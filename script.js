const form = document.getElementById("studentForm");
const successMessage = document.getElementById("successMessage");
const submittedData = document.getElementById("submittedData");
const newFormBtn = document.getElementById("newFormBtn");

const MAX_RESUME_SIZE = 5 * 1024 * 1024;
const ALLOWED_RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const validators = {
  firstName: (value) => (!value.trim() ? "First name is required." : ""),
  lastName: (value) => (!value.trim() ? "Last name is required." : ""),
  dob: (value) => {
    if (!value) return "Date of birth is required.";
    const date = new Date(value);
    const today = new Date();
    if (date > today) return "Date of birth cannot be in the future.";
    return "";
  },
  email: (value) => {
    if (!value.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
    return "";
  },
  phone: (value) => {
    if (!value.trim()) return "Phone number is required.";
    if (!/^[\d\s+\-()]{7,20}$/.test(value)) return "Enter a valid phone number.";
    return "";
  },
  studentId: (value) => (!value.trim() ? "Student ID is required." : ""),
  university: (value) => (!value.trim() ? "University is required." : ""),
  course: (value) => (!value.trim() ? "Course is required." : ""),
  year: (value) => (!value ? "Please select a year of study." : ""),
};

function showError(fieldName, message) {
  const field = form.elements[fieldName];
  const errorEl = document.querySelector(`[data-for="${fieldName}"]`);
  if (field) field.classList.toggle("invalid", Boolean(message));
  if (errorEl) errorEl.textContent = message;
}

function validateField(fieldName) {
  const field = form.elements[fieldName];
  if (!field || !validators[fieldName]) return true;
  const message = validators[fieldName](field.value);
  showError(fieldName, message);
  return !message;
}

function validateResume() {
  const fileInput = form.elements.resume;
  const file = fileInput.files[0];
  if (!file) {
    showError("resume", "");
    return true;
  }
  if (!ALLOWED_RESUME_TYPES.includes(file.type)) {
    showError("resume", "Only PDF, DOC, or DOCX files are allowed.");
    return false;
  }
  if (file.size > MAX_RESUME_SIZE) {
    showError("resume", "File must be 5 MB or smaller.");
    return false;
  }
  showError("resume", "");
  return true;
}

function validateForm() {
  let isValid = true;
  Object.keys(validators).forEach((fieldName) => {
    if (!validateField(fieldName)) isValid = false;
  });
  if (!validateResume()) isValid = false;
  return isValid;
}

function collectFormData() {
  const data = {
    firstName: form.firstName.value.trim(),
    lastName: form.lastName.value.trim(),
    dob: form.dob.value,
    gender: form.gender.value || "Not specified",
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    address: form.address.value.trim() || "Not provided",
    studentId: form.studentId.value.trim(),
    university: form.university.value.trim(),
    course: form.course.value.trim(),
    year: form.year.options[form.year.selectedIndex].text,
  };

  const resumeFile = form.resume.files[0];
  if (resumeFile) {
    data.resume = `${resumeFile.name} (${(resumeFile.size / 1024).toFixed(1)} KB)`;
  }

  return data;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateForm()) return;

  const data = collectFormData();
  submittedData.textContent = JSON.stringify(data, null, 2);

  form.classList.add("hidden");
  successMessage.classList.remove("hidden");
});

form.addEventListener("input", (event) => {
  const { name } = event.target;
  if (validators[name]) validateField(name);
});

form.elements.resume.addEventListener("change", validateResume);

form.addEventListener("reset", () => {
  Object.keys(validators).forEach((fieldName) => showError(fieldName, ""));
  showError("resume", "");
  form.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
});

newFormBtn.addEventListener("click", () => {
  form.reset();
  successMessage.classList.add("hidden");
  form.classList.remove("hidden");
});
