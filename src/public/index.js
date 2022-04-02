let socket = io();

let chatBox = document.getElementById("chatBox");
let userNameObj = document.getElementById("userName");
let inputText = document.getElementById("inputText");
let imgUserObj = document.getElementById("imgUser");

let user;
let userImg = "";

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

// alert for user identification
Swal.fire({
  title: "Welcome to the chat room",
  input: "text",
  inputPlaceholder: "Enter your name",
  allowOutsideClick: false,
  inputValidator: (value) => {
    if (!value) {
      return "You need to write User Name!";
    }
  },
}).then((res) => {
  user = res.value;
  userImg = `https://nextbootstrap.netlify.app/assets/images/profiles/${
    Math.floor(Math.random() * 10) + 1
  }.jpg`;
  imgUserObj.innerHTML = `<img id="imgUser" src="${userImg}" class="img-fluid rounded-circle" alt=""></img>`;
  userNameObj.innerHTML = `<a id="userName" href="#!" class="nav-link">${user}</a>`;
});

inputText.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    if (inputText.value.trim().length > 0) {
      socket.emit("message", {
        user: user,
        userImg: userImg,
        message: inputText.value.trim(),
        date: formatAMPM(new Date()),
      });
      inputText.value = "";
    }
  }
});

// sockets
socket.on("log", (data) => {
  let messages = "";
  data.forEach((item) => {
    if (item.user == user) {
      messages =
        messages +
        `      <div class="d-flex align-items-baseline mb-4">
      <div class="position-relative avatar">
          <img src="${item.userImg}"
              class="img-fluid rounded-circle" alt="" style="width:40px; height: 40px; border-radius: 40%; padding: 2px">
      </div>
      <div class="pe-2">
          <div>
              <div class="card card-text d-inline-block p-2 px-3 m-1">${item.message}
              </div>
          </div>
          <div>
              <div class="small">${item.date}</div>
          </div>
      </div>
      </div>`;
    } else {
      messages =
        messages +
        `<div class="d-flex align-items-baseline text-end justify-content-end mb-4">
        <div class="pe-2">
            <div>
                <div class="card card-text d-inline-block p-2 px-3 m-1">${item.message}</div>
            </div>
            <div>
                <div class="small">${item.date}</div>
            </div>
        </div>
        <div class="position-relative avatar">
            <img src="${item.userImg}"
                class="img-fluid rounded-circle" alt="" style="width:40px; height: 40px; border-radius: 40%; padding: 2px">
                <p class="small">${item.user}</p>
        </div>
    </div>`;
    }
  });
  chatBox.innerHTML = messages;
});
