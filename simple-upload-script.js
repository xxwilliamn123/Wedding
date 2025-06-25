// Ultra Simple Wedding Photo Upload Handler
function doPost(e) {
  console.log('=== POST REQUEST RECEIVED ===');
  console.log('Event object:', e);
  console.log('Event type:', typeof e);
  
  // Always return a response, even if no event object
  if (!e) {
    console.log('No event object - returning error');
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'No event object received',
        debug: 'Event object is null or undefined'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  try {
    // Log all available properties
    console.log('Event properties:', Object.keys(e));
    
    // Try to get data from parameters
    let data = {};
    if (e.parameter) {
      console.log('e.parameter found:', Object.keys(e.parameter));
      data = e.parameter;
    }
    
    // Try to get data from postData
    if (e.postData && e.postData.contents) {
      console.log('e.postData found:', e.postData.type);
      try {
        const jsonData = JSON.parse(e.postData.contents);
        data = { ...data, ...jsonData };
        console.log('JSON data parsed:', Object.keys(jsonData));
      } catch (error) {
        console.log('JSON parse error:', error);
      }
    }
    
    console.log('Final data object:', data);
    
    // Extract data with defaults
    const guestName = data.guestName || 'Unknown Guest';
    const guestEmail = data.guestEmail || 'unknown@example.com';
    const fileName = data.fileName || 'unknown.jpg';
    const description = data.description || 'No description';
    const fileData = data.fileData || '';
    
    console.log('Processing:', { guestName, guestEmail, fileName, hasFileData: fileData.length > 0 });
    
    // Create a simple response
    const response = {
      success: true,
      message: 'Request received successfully',
      data: {
        guestName: guestName,
        guestEmail: guestEmail,
        fileName: fileName,
        description: description,
        fileDataLength: fileData.length
      },
      debug: {
        eventExists: !!e,
        hasParameter: !!e.parameter,
        hasPostData: !!(e.postData && e.postData.contents),
        dataKeys: Object.keys(data)
      }
    };
    
    console.log('Sending response:', response);
    
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Error processing request',
        error: error.toString(),
        debug: {
          eventExists: !!e,
          eventType: typeof e
        }
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  console.log('GET request received');
  return ContentService
    .createTextOutput("Wedding Photo Upload Service is running!")
    .setMimeType(ContentService.MimeType.TEXT);
}

function getOrCreateFolder(folderName) {
  try {
    const folders = DriveApp.getFoldersByName(folderName);
    if (folders.hasNext()) {
      return folders.next();
    } else {
      return DriveApp.createFolder(folderName);
    }
  } catch (error) {
    console.error('Folder error:', error);
    return DriveApp.createFolder(folderName);
  }
}

function sendConfirmationEmail(guestEmail, guestName, fileName) {
  const subject = 'Photo Upload Confirmation - Wedding Website';
  const body = `Dear ${guestName},\n\nThank you for uploading "${fileName}"!\n\nBest regards,\nThe Wedding Couple`;
  
  GmailApp.sendEmail(guestEmail, subject, body);
  console.log('Confirmation sent to:', guestEmail);
}

function sendAdminNotification(guestName, guestEmail, fileName, description) {
  const adminEmail = 'montengro.cyndie1416@gmail.com';
  const subject = 'New Photo Upload - Wedding Website';
  const body = `New upload:\nGuest: ${guestName}\nEmail: ${guestEmail}\nFile: ${fileName}\nDescription: ${description}`;
  
  GmailApp.sendEmail(adminEmail, subject, body);
  console.log('Admin notification sent to:', adminEmail);
} 