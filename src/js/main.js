// Contact form Submission
const send = document.querySelector("#send");
const form = document.querySelector("#contact-form");

send.addEventListener("click", (event) => {
  event.preventDefault();

  const data = {
    name: document.querySelector("#name").value,
    email: document.querySelector("#email").value,
    message: document.querySelector("#message").value,
  };

  Swal.fire(
    "Message Sent Successfully!",
    "Your message is as follows:<br />Name: " +
      data.name +
      "<br />Email: " +
      data.email +
      (data.message ? "<br />Message: " + data.message : ""),
    "success"
  );
  
  form.submit();
});
