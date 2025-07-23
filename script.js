let isEligible = false;

document.addEventListener("DOMContentLoaded", () => {
  // Inject form HTML
  fetch("form.html")
    .then(response => response.text())
    .then(html => {
      document.getElementById("form-container").innerHTML = html;
    });
});

function registerStudent(event) {
  event.preventDefault();
  const form = document.forms['studentForm'];
  const student = {
    name: form.name.value,
    email: form.email.value,
    gender: form.gender.value,
    year: form.year.value,
    city: form.city.value,
    country: form.country.value,
    phone: form.phone.value,
    parentPhone: form.parentPhone.value,
    distance: form.distance.value,
    roomType: form.room_type.value
  };
  let students = JSON.parse(localStorage.getItem("students") || "[]");
  const index = students.findIndex(s => s.email === student.email);
  if (index !== -1) students[index] = student;
  else students.push(student);
  localStorage.setItem("students", JSON.stringify(students));
  alert("Student Registered Successfully!");
}

function checkStatus(event) {
  event.preventDefault();
  const email = document.getElementById("checkEmail").value.trim();
  const students = JSON.parse(localStorage.getItem("students") || "[]");
  const student = students.find(s => s.email === email);
  const statusDiv = document.getElementById("statusResult");

  if (student) {
    const distance = parseFloat(student.distance);
    const country = student.country.trim().toLowerCase();
    let reasons = [];

    if (country !== 'india') reasons.push("Student must be from India.");
    if (distance <= 10) reasons.push("Student must live more than 10 km away from the college.");

    let fee = 0;
    switch (student.roomType) {
      case "Single - AC": fee = 100000; break;
      case "Single - Non-AC": fee = 90000; break;
      case "Shared - AC": fee = 80000; break;
      case "Shared - Non-AC": fee = 70000; break;
    }

    isEligible = reasons.length === 0;

    statusDiv.innerHTML = `
      <b>Status:</b> ${isEligible ? '✅ Allotment Approved' : '❌ Allotment Not Approved'}<br>
      ${!isEligible ? `<div class="alert alert-danger mt-2"><b>Reason:</b><br>• ${reasons.join('<br>• ')}</div>` : ''}
      <b>Name:</b> ${student.name}<br>
      <b>City:</b> ${student.city}<br>
      <b>Country:</b> ${student.country}<br>
      <b>Distance:</b> ${distance} km<br>
      <b>Room:</b> ${student.roomType}<br>
      <b>Phone:</b> ${student.phone}<br>
      <b>Parent's Phone:</b> ${student.parentPhone}<br>
      <b>Fee:</b> ₹${fee}/year
    `;
  } else {
    isEligible = false;
    statusDiv.innerHTML = `<span class="text-danger">No record found for this email.</span>`;
  }
}

function calculateFee(event) {
  event.preventDefault();
  if (!isEligible) {
    alert("You are not eligible. Payment not allowed.");
    document.getElementById("paymentForm").style.display = 'none';
    return;
  }
  const roomType = document.getElementById("roomType").value;
  let fee = 0;
  switch (roomType) {
    case "Single - AC": fee = 100000; break;
    case "Single - Non-AC": fee = 90000; break;
    case "Shared - AC": fee = 80000; break;
    case "Shared - Non-AC": fee = 70000; break;
  }
  document.getElementById("feeResult").innerText = `Estimated Annual Hostel Fee: ₹${fee}`;
  document.getElementById("paymentForm").style.display = 'block';
}

function processPayment(event) {
  event.preventDefault();
  if (!isEligible) {
    alert("Payment not allowed.");
    return;
  }
  document.getElementById("paymentStatus").innerText = "✅ Payment Successful!";
}
