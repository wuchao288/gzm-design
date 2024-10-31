function clearblankimg(imgData) {
    return new Promise((resolve, reject) => {
        var img = new Image();//创建图片对象
        img.src = imgData;
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            console.log(img.width, img.height);
            ctx.drawImage(img, 0, 0);
            // 获取图像的像素数据
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            // 找到非白色像素的边界
            let minX = canvas.width;
            let minY = canvas.height;
            let maxX = -1;
            let maxY = -1;
            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const index = (y * canvas.width + x) * 4; // 每个像素有4个通道（RGBA）
                    const red = data[index];
                    const green = data[index + 1];
                    const blue = data[index + 2];
                    // 判断像素是否为白色 (255, 255, 255)
                    if (red === 255 && green === 255 && blue === 255) {
                        // 此像素是白色，跳过
                    } else {
                        // 非白色像素
                        minX = Math.min(minX, x);
                        minY = Math.min(minY, y);
                        maxX = Math.max(maxX, x);
                        maxY = Math.max(maxY, y);
                    }
                }
            }
            // 计算剪切后的图像宽度和高度
            const croppedWidth = maxX - minX + 1;
            const croppedHeight = maxY - minY + 1;
            // 创建一个新的Canvas，将非白色区域绘制到新Canvas上
            const newCanvas = document.createElement('canvas');
            const newCtx = newCanvas.getContext('2d');
            newCanvas.width = croppedWidth;
            newCanvas.height = croppedHeight;
            newCtx.drawImage(canvas, minX, minY, croppedWidth, croppedHeight, 0, 0, croppedWidth, croppedHeight);
            // 将处理后的图像显示在页面上的<img>元素中
            console.log(newCanvas.toDataURL());
            resolve(newCanvas.toDataURL())
        };
    })
}
 
export default clearblankimg
