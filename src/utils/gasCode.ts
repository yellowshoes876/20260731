export const GAS_CODE_GS = `/**
 * [우리반 전자 독서기록장] 구글 앱스 스크립트 (Code.gs)
 * 
 * [설치 및 배포 가이드]
 * 1. 구글 드라이브(https://drive.google.com) 접속 -> 새 만들기 -> Google Apps Script 선택
 * 2. 기존 작성된 코드를 모두 지우고 본 코드를 그대로 복사하여 붙여넣습니다.
 * 3. 상단 [배포] 버튼 클릭 -> [새 배포] 클릭
 * 4. 톱니바퀴 아이콘 -> [웹 앱] 선택
 * 5. 설정 값:
 *    - 설명: 우리반 독서기록장 API
 *    - 다음 사용자 권한으로 실행: '나(Me)'
 *    - 액세스 권한이 있는 사용자: '모든 사용자(Anyone)' (중요!)
 * 6. [배포] 클릭 후 생성된 [웹 앱 URL]을 복사하여 독서기록장 웹사이트 연동 설정창에 입력하세요.
 */

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("독서기록");
    if (!sheet) {
      sheet = initSheet(ss);
    }
    
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return responseJSON({ status: "success", data: [] });
    }
    
    var headers = data[0];
    var logs = [];
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0]) continue; // ID가 없는 빈 행 건너뜀
      logs.push({
        id: String(row[0]),
        grade: String(row[1]),
        classNum: String(row[2]),
        studentName: String(row[3]),
        bookTitle: String(row[4]),
        author: String(row[5]),
        publisher: String(row[6]),
        summary: String(row[7]),
        review: String(row[8]),
        rating: Number(row[9]) || 5,
        date: String(row[10]),
        createdAt: Number(row[11]) || new Date(row[10]).getTime()
      });
    }
    
    return responseJSON({ status: "success", data: logs });
  } catch (err) {
    return responseJSON({ status: "error", message: err.toString() });
  }
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("독서기록");
    if (!sheet) {
      sheet = initSheet(ss);
    }
    
    var contents = e.postData ? e.postData.contents : null;
    var payload = {};
    if (contents) {
      payload = JSON.parse(contents);
    } else if (e.parameter) {
      payload = e.parameter;
    }
    
    var action = payload.action || "add";
    
    if (action === "delete") {
      var deleteId = payload.id;
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(deleteId)) {
          sheet.deleteRow(i + 1);
          return responseJSON({ status: "success", message: "deleted" });
        }
      }
      return responseJSON({ status: "error", message: "Record not found" });
    }
    
    // 기본 동작: 독서기록 추가
    var newLog = payload.log || payload;
    var id = newLog.id || "log_" + new Date().getTime();
    var grade = newLog.grade || "";
    var classNum = newLog.classNum || "";
    var studentName = newLog.studentName || "";
    var bookTitle = newLog.bookTitle || "";
    var author = newLog.author || "";
    var publisher = newLog.publisher || "";
    var summary = newLog.summary || "";
    var review = newLog.review || "";
    var rating = newLog.rating || 5;
    var date = newLog.date || Utilities.formatDate(new Date(), "GMT+9", "yyyy-MM-dd");
    var createdAt = newLog.createdAt || new Date().getTime();
    
    sheet.appendRow([
      id, grade, classNum, studentName, bookTitle, author, publisher, summary, review, rating, date, createdAt
    ]);
    
    return responseJSON({ status: "success", data: newLog });
  } catch (err) {
    return responseJSON({ status: "error", message: err.toString() });
  }
}

function initSheet(ss) {
  var sheet = ss.insertSheet("독서기록");
  var headers = ["ID", "학년", "반", "이름", "도서명", "저자", "출판사", "줄거리", "한줄소감", "별점", "날짜", "생성타임스탬프"];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#0F172A").setFontColor("#FFFFFF");
  sheet.setFrozenRows(1);
  return sheet;
}

function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
