## 1.0.0-beta.1(2023-12-08)
- 代码开源
// 假设要发送一个JSON对象给父窗口
var messageData = { type: 'update', content: 'Some data' };

// 发送给父窗口
parent.postMessage(messageData, '*'); // '*' 表示任何源都可以接收，实际应用中应更精确控制



// 添加message事件监听器
window.addEventListener('message', function(event) {
  // 检查消息来源是否可信
  if (event.origin !== 'https://trusted-origin.com') return; // 替换为实际信任的源

  var data = event.data;

  if (data.type === 'update') {
    console.log('Received update:', data.content);
    // 根据数据内容进行相应处理
  }
});