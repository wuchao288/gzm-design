
let lastConfigString = null;

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const canvasShade = document.createElement('canvas');
const canvasShadeMin = document.createElement('canvas');
const canvasMin = document.createElement('canvas');
const pencilTextureCanvas = document.createElement('canvas');

  const louvre = async ({img, outputCanvas, config}) => {
	if (!img || !config) return;

	const configString = [
		JSON.stringify(config),
		img.src,
	].join('-');

	if (lastConfigString === configString) return;

	console.time('louvre');

	lastConfigString = configString;

	const oriWidth = img.naturalWidth;
	const oriHeight = img.naturalHeight;

	let oriScale = oriWidth / oriHeight;

	let _width  = Math.round( oriWidth   / config.zoom );
	let _height = Math.round( oriHeight  / config.zoom );

	const maxWidth = 1920;
	if(_width > maxWidth){
		_height = _height * maxWidth / _width
		_width = maxWidth
	}


	let cutLeft = 0;
	let cutTop = 0;

	let calcWidth = oriWidth;
	let calcHeight = oriHeight;

	if(config.cover){

		if(oriScale > 1){
			cutLeft = (oriScale - 1) * oriHeight / 2;
			cutLeft = Math.round(cutLeft);
			calcWidth = oriHeight;
			_width = _height;
		}else{
			cutTop =  (1 - oriScale) * oriHeight / 2;
			cutTop = Math.round(cutTop);
			calcHeight = oriWidth;
			_height = _width;
		}
	}


	let setLeft = 0;
	let setTop = 0;

	let setWidth = _width;
	let setHeight = _height;


	canvas.width = _width;
	canvas.height = _height;



	ctx.drawImage(
		img,
		cutLeft, cutTop,
		calcWidth, calcHeight,

		setLeft, setTop,
		setWidth, setHeight
	);


	let pixel = ctx.getImageData(0, 0, _width, _height);

	let pixelData = pixel.data;

	for (let i = 0; i < pixelData.length; i += 4) {

		const r = pixelData[i];
		const g = pixelData[i + 1];
		const b = pixelData[i + 2];
		
		let y = r * .299000 + g * .587000 + b * .114000;
		y = Math.floor(y);

		pixelData[i    ] = y;
		pixelData[i + 1] = y;
		pixelData[i + 2] = y;
	}
	let shadePixel;

	const { 
		shadeLimit = 80,
		shadeLight = 40 
	} = config;
	let pencilTexturePixel;
	if(config.shade){

		console.info(config.shade)
		// 载入纹理
		pencilTextureCanvas.width = _width;
		pencilTextureCanvas.height = _height;
		const pencilTextureCtx = pencilTextureCanvas.getContext('2d');
		const pencilSetWidthHeight = Math.max(_width,_height);
		pencilTextureCtx.drawImage(
			pencilTextureEl,
			0,0,
			1200,1200,
			0,0,
			pencilSetWidthHeight,pencilSetWidthHeight
		);
		pencilTexturePixel = pencilTextureCtx.getImageData(0,0,_width,_height);


		// 处理暗面
		shadePixel = ctx.createImageData(_width, _height);

		for (let i = 0; i < pixelData.length; i += 4) {
			let y = pixelData[i];

			y = y > shadeLimit ? 0 : 255; //((255 - pencilTexturePixel.data[i]) + Math.random() * 40 - 20);

			// y = Math.max(255-y) * 0.6;

			shadePixel.data[i    ] = y;
			shadePixel.data[i + 1] = 128;
			shadePixel.data[i + 2] = 128;
			shadePixel.data[i + 3] = Math.floor(Math.random() * 255)//Math.ceil( y + Math.random() * 40 - 20);
		}

		// /*
		// document.body.appendChild(canvasShade)

		const ctxShade = canvasShade.getContext('2d');
		const ctxShadeMin = canvasShadeMin.getContext('2d');
		
		canvasShade.width = _width;
		canvasShade.height = _height;

		// console.log({shadePixel})

		ctxShade.putImageData(shadePixel, 0, 0);

		// ctxShade.fillText('123233',50,50);
		const shadeZoom = 4;
		canvasShadeMin.width = Math.floor(_width/shadeZoom);
		canvasShadeMin.height = Math.floor(_height/shadeZoom);

		ctxShadeMin.drawImage(
			canvasShade,
			0,0,
			canvasShadeMin.width,canvasShadeMin.height
		);

		ctxShade.clearRect(0,0,_width,_height)
		ctxShade.drawImage(
			canvasShadeMin,
			0,0,
			_width,_height
		);
		shadePixel = ctxShade.getImageData(0,0,_width,_height);

		for (let i = 0; i < shadePixel.data.length; i += 4) {
			let y = shadePixel.data[i];

			y = Math.round((255-pencilTexturePixel.data[i]) / 255 * y / 255 * shadeLight); //((255 - pencilTexturePixel.data[i]) + Math.random() * 40 - 20);

			// y = Math.max(255-y) * 0.6;

			shadePixel.data[i    ] = y;
		}

	}
	
	const { 
		light = 0,
	} = config;
	if(light){

		
		for (let i = 0; i < pixelData.length; i += 4) {
			let y = pixelData[i];

			y = y + y * (light/100);
	
			pixelData[i    ] = y;
			pixelData[i + 1] = y;
			pixelData[i + 2] = y;
		}

	}


	if(config.denoise){
		pixel = convoluteY(
			pixel,
			[
				1/9, 1/9, 1/9,
				1/9, 1/9, 1/9,
				1/9, 1/9, 1/9
			],
			ctx
		);
	}
	

	const convoluteMatrix = config.Convolutes[config.convoluteName];
	

	let pixel1 = convoluteMatrix ? convoluteY(
		pixel,
		convoluteMatrix,
		ctx
	) : pixel;

	if(convoluteMatrix && config.convolute1Diff){
		let pixel2 = config.convoluteName2 ? convoluteY(
			pixel,
			config.Convolutes[config.convoluteName2],
			ctx
		) : pixel;
		
		// console.log(/pixel2/,config.Convolutes[config.convoluteName2],pixel2);
		// pixelData
		for (let i = 0; i < pixel2.data.length; i +=4) {
			let r = 128 + pixel2.data[i  ] - pixel1.data[i  ];
			pixel2.data[i  ] = r;
			pixel2.data[i+1] = r;
			pixel2.data[i+2] = r;
			pixel2.data[i+3] = 255;
		}
		pixel = pixel2;
	}else{
		// 不对比
		pixel = pixel1;
	}

	pixelData = pixel.data;


	if(convoluteMatrix)

	if(config.lightCut || config.darkCut){

		
		console.info("config.lightCut",config.lightCut)

		const scale = 255 / (255 - config.lightCut - config.darkCut);
		for (let i = 0; i < pixelData.length; i += 4) {
			let y = pixelData[i];

			y = (y - config.darkCut) * scale;
			
			y = Math.max(0,y);
			
			pixelData[i+0 ] = y
			pixelData[i+1 ] = y
			pixelData[i+2 ] = y
			pixelData[i+3 ] = 255
		}
	}

	if(config.kuma){

		console.info("config.kuma",config.kuma)

		const hStart = 30;
		const hEnd = -184;
		const gradient = ctx.createLinearGradient(0,0, _width,_height);
	
		gradient.addColorStop(0, '#fbba30');
		gradient.addColorStop(0.4, '#fc7235');
		gradient.addColorStop(.6, '#fc354e');
		gradient.addColorStop(.7, '#cf36df');
		gradient.addColorStop(.8, '#37b5d9');
		gradient.addColorStop(1, '#3eb6da');
	
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, _width, _height);
		let gradientPixel = ctx.getImageData(0, 0, _width, _height);
		
		for (let i = 0; i < pixelData.length; i += 4) {
			let y = pixelData[i];
			let p = Math.floor(i / 4);
	
			let _h = Math.floor(p/_width);
			let _w = p % _width;
	

			pixelData[i+0 ] = gradientPixel.data[i + 0];
			pixelData[i+1 ] = gradientPixel.data[i + 1];
			pixelData[i+2 ] = gradientPixel.data[i + 2];
			
			y = 255 - y;
			if(config.shade){
				y = Math.max(
					y,
					shadePixel.data[i]
				);
			}
			pixelData[i+3 ] = y
		}
	
	}

	var rgba = [255,255,255,255];
	// 容差大小
	var tolerance = 80;

	for (var index = 0; index < pixel.data.length; index += 4) {
		var r = pixel.data[index];
		var g = pixel.data[index + 1];
		var b = pixel.data[index + 2];
		
		if (Math.sqrt(
			(r - rgba[0]) * (r - rgba[0]) + 
			(g - rgba[1]) * (g - rgba[1]) + 
			(b - rgba[2]) * (b - rgba[2])) <= tolerance
		) {
			pixel.data[index] = 0;
			pixel.data[index + 1] = 0;
			pixel.data[index + 2] = 0;
			pixel.data[index + 3] = 0;
		} else {
			pixel.data[index] = r;
			pixel.data[index + 1] = g;
			pixel.data[index + 2] = b;
			pixel.data[index + 3] = pixel.data[index + 3];
		}
	}

	ctx.putImageData(pixel, 0, 0);

	const ctxMin = canvasMin.getContext('2d');

	canvasMin.width = Math.floor(_width/1.4);
	canvasMin.height = Math.floor(_height/1.3);

	ctxMin.clearRect(0,0,canvasMin.width,canvasMin.height)
	ctxMin.drawImage(
		canvas,
		0,0,
		canvasMin.width,canvasMin.height
	);
	
	ctx.clearRect(0,0,_width,_height)
	ctx.drawImage(
		canvasMin,
		0,0,
		canvasMin.width,canvasMin.height,
		0,0,_width,_height
	);

	const outputCtx = outputCanvas.getContext('2d');

	outputCanvas.width = _width;
	outputCanvas.height = _height;
	//outputCtx.fillStyle = '#FFF';
	//outputCtx.fillRect(0,0,_width,_height);
	outputCtx.drawImage(
		canvas,
		0,0,_width,_height
	);


	console.timeEnd('louvre');
};

 let loadImage = (url,onOver)=>{
	const el = new Image();
	el.onload = _=>onOver(el);
	el.src = url;
};
 let loadImagePromise = async url=>{
	return new Promise(function(resolve, reject){
		setTimeout(function(){
			const el = new Image();
			el.onload = _=>resolve(el);
			el.onerror = e=>reject(e);
			el.src = url;
		}, 2000);
	});
}

let watermarkImageEl;
let pencilTextureEl;
 const louvreInit = onOver=>{
	loadImage(new URL("@/assets/images/pencil-texture.jpg",import.meta.url).href,el=>{
		pencilTextureEl = el;
		onOver();
		
	});
};


 let convolute = (pixels, weights, ctx) => {
	const side = Math.round(Math.sqrt(weights.length));
	const halfSide = Math.floor(side / 2);

	const src = pixels.data;
	const sw = pixels.width;
	const sh = pixels.height;

	const w = sw;
	const h = sh;
	const output = ctx.createImageData(w, h);
	const dst = output.data;


	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			const sy = y;
			const sx = x;
			const dstOff = (y * w + x) * 4;
			let r = 0, g = 0, b = 0;
			for (let cy = 0; cy < side; cy++) {
				for (let cx = 0; cx < side; cx++) {
					const scy = Math.min(sh - 1, Math.max(0, sy + cy - halfSide));
					const scx = Math.min(sw - 1, Math.max(0, sx + cx - halfSide));
					const srcOff = (scy * sw + scx) * 4;
					const wt = weights[cy * side + cx];
					r += src[srcOff] * wt;
					g += src[srcOff + 1] * wt;
					b += src[srcOff + 2] * wt;
				}
			}
			dst[dstOff] = r;
			dst[dstOff + 1] = g;
			dst[dstOff + 2] = b;
			dst[dstOff + 3] = 255;
		}
	}


	// for (let y=0; y<h; y++) {
	// 	for (let x=0; x<w; x++) {
	// 		const srcOff = (y*w+x)*4;
	// 		src[srcOff] = dst[srcOff];
	// 	}
	// }
	return output;
};



 const convoluteY = (pixels, weights, ctx) => {
	const side = Math.round( Math.sqrt( weights.length ) );
	const halfSide = Math.floor(side / 2);

	const src = pixels.data;

	const w = pixels.width;
	const h = pixels.height;
	const output = ctx.createImageData(w, h);
	const dst = output.data;

	for (let sy = 0; sy < h; sy++) {
		for (let sx = 0; sx < w; sx++) {
			const dstOff = (sy * w + sx) * 4;
			let r = 0, g = 0, b = 0;

			for (let cy = 0; cy < side; cy++) {
				for (let cx = 0; cx < side; cx++) {

					const scy = Math.min(h - 1, Math.max(0, sy + cy - halfSide));
					const scx = Math.min(w - 1, Math.max(0, sx + cx - halfSide));

					const srcOff = (scy * w + scx) * 4;
					const wt = weights[cy * side + cx];

					r += src[srcOff] * wt;
					// g += src[srcOff + 1] * wt;
					// b += src[srcOff + 2] * wt;
				}
			}
			dst[dstOff] = r;
			dst[dstOff + 1] = r;
			dst[dstOff + 2] = r;
			dst[dstOff + 3] = 255;
		}
	}


	// for (let y=0; y<h; y++) {
	// 	for (let x=0; x<w; x++) {
	// 		const srcOff = (y*w+x)*4;
	// 		src[srcOff] = dst[srcOff];
	// 	}
	// }
	return output;
};


export const util ={
    louvre,
    loadImagePromise,
    louvreInit,
    convolute,
    convoluteY
}