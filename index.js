function loadReservations() {
  fetch('https://badminton-court-crawler-repo.onrender.com/api/reservations')
    .then(response => response.json())
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) {
        document.getElementById('result').innerHTML = "<p>目前没有任何预约。</p>";
        return;
      }
      // 按照日期先后排序
      data.sort((a, b) => {
        // 提取日期部分（去掉后面的括号内容, 并通过函数转换日期的格式为标准格式

        const aDateParts = dateFormating(a.date.split(' ')[0]); // "2025/6/14"
        const bDateParts = dateFormating(b.date.split(' ')[0]); // "2025/6/15"
        

        // 取时间段开始时间
        const aTimeStr = a.time.split('～')[0]; // "18:00"
        const bTimeStr = b.time.split('～')[0]; // "17:00"

        const [aHour, aMinute] = aTimeStr.split(':').map(Number);
        const [bHour, bMinute] = bTimeStr.split(':').map(Number);

        // 构造标准 JS 日期字符串并转为 Date 对象
        const aDateTime = new Date(aDateParts.year, aDateParts.month, aDateParts.day, aHour, aMinute);
        const bDateTime = new Date(bDateParts.year, bDateParts.month, bDateParts.day, bHour, bMinute);
      
        
        // 测试代码
        // console.log('aDateStr:', aDateStr, 'aTimeStr:', aTimeStr, 'aDateTime:', aDateTime);
        // console.log('bDateStr:', bDateStr, 'bTimeStr:', bTimeStr, 'bDateTime:', bDateTime);

        return aDateTime - bDateTime;
      });
      

      let table = `<table>
        <tr>
          <th>场馆</th>
          <th>日期</th>
          <th>时间</th>
          <th>状态</th>
          <th>最晚取消</th>
        </tr>`;

      data.forEach(item => {
        table += `
          <tr>
            <td>${item.facility}</td>
            <td>${item.date}</td>
            <td>${item.time}</td>
            <td>${item.status}</td>
            <td>${item.cancel_before}</td>
          </tr>`;
      });

      table += `</table>`;
      document.getElementById('result').innerHTML = table;
    })
    .catch(error => {
      document.getElementById('result').innerHTML = `<p style="color:red;">请求失败: ${error}</p>`;
    });
}

function dateFormating(dateStrUnformat) {
  const parts = dateStrUnformat.split('/').map(Number); // [2025, 6, 15]
  return {
    year: parts[0],
    month: parts[1] - 1, // JavaScript 的月份是 0~11
    day: parts[2]
  };
}
loadReservations();
