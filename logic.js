function formatRegistration(reg) {
  return reg.toUpperCase().replace(/(.{2})(.{2})(.*)/, "$1$2$3");
}

function formatDateToIST(date) {
  const options = {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  let formattedDate = date.toLocaleString("en-IN", options);
  // Adjust the format to day/month/year
  formattedDate = formattedDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$1/$2/$3");
  // Capitalize AM/PM
  formattedDate = formattedDate.replace(/(am|pm)/i, (m) => m.toUpperCase());
  return formattedDate + " IST";
}

function displayInfo() {
  const params = new URLSearchParams(window.location.search);
  const regQuery = params.get("r");
  const timeQuery = params.get("t");
  const wrapper = document.getElementById("wrapper");
  const errorMessage = document.getElementById("error_message");

  if (!regQuery || !timeQuery) {
    errorMessage.innerHTML =
      '<img src="assets/404-page-colored.png" alt="Inalid URL">';
    wrapper.style.display = "none";
    return;
  }

  const displayElement = document.getElementById("display");
  const statusElement = document.getElementById("status");
  const timeInfoElement = document.getElementById("timeInfo");

  // Convert the 'r' parameter to lowercase
  const lowerCaseRegQuery = regQuery.toLowerCase();
  const formattedReg = formatRegistration(lowerCaseRegQuery);
  displayElement.textContent = formattedReg;

  // Handle both second and millisecond timestamps
  let linkTime = parseInt(timeQuery);
  if (linkTime > 1e11) {
    // If timestamp is in milliseconds
    linkTime = Math.floor(linkTime / 1000);
  }

  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  const timeDiff = (currentTime - linkTime) / (60 * 60); // Difference in hours

  const linkDate = new Date(linkTime * 1000); // Convert seconds to milliseconds
  timeInfoElement.textContent = `Generated: ${formatDateToIST(linkDate)}`;

  if (statusElement)
    if (timeDiff <= 4) {
      statusElement.textContent = "VALID PASS";
      // document.body.style.backgroundColor = "#73EC8B";
      qr.classList.remove("shadow-xl", "drop-shadow-2xl", "shadow-stone-700");
    } else {
      statusElement.textContent = "NOT VALID";

      qr.classList.add("shadow-2xl", "drop-shadow-2xl", "shadow-white-400");
      document.body.style.backgroundColor = "#e5383b";
    }

  // Generate QR code using only the 'r' parameter
  new QRCode(document.getElementById("qrcode"), {
    text: lowerCaseRegQuery,
    width: 256,
    height: 256,
    colorDark: "#000000",
    colorLight: "#f3f4f6",
    correctLevel: QRCode.CorrectLevel.H,
  });
}

window.onload = displayInfo;
