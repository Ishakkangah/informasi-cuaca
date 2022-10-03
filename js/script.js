const wrapper = document.querySelector(".wrapper");
const input_path = document.querySelector(".input_part");
const info_text = document.querySelector(".info_text");
const input_Field = document.querySelector(".input_part input");
const location_Button = document.getElementById("btn_Location");
const arrow_Back = document.querySelector(".wrapper header i");
let weather_Icons = document.querySelector(".weather_part img");

let api;

input_Field.addEventListener("keyup", function (e) {
  // Jika user tekan tekan dan hasil value tidak kosong atau input value ada, jalan kan fungsi requestApi
  if (e.key === "Enter" && input_Field.value !== "") {
    requestApi(input_Field.value);
  }
});

location_Button.addEventListener("click", function () {
  // navigator.geolocation untuk menampilkan lokasi user
  if (navigator.geolocation) {
    // jika browser user mendukung geolocation Api
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your browser not support geolocation Api!");
  }
});

// Jika berhasil
function onSuccess(position) {
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=7b7d073552be870b3e2ae445a0a603ea&lang=ID&units=metric`;
  fetchData();
}

// Jika error
function onError(error) {
  info_text.innerHTML = error.message;
  info_text.classList.add("error");
}

// Request API
function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=7b7d073552be870b3e2ae445a0a603ea&lang=ID&units=metric`;
  fetchData();
}

function fetchData() {
  info_text.innerHTML = "Getting weather details...";
  info_text.classList.add("pending");
  fetch(api)
    .then((response) => response.json())
    .then((result) => weatherDetails(result));
}

function weatherDetails(info) {
  if (info.cod === "404") {
    info_text.innerHTML = `${input_Field.value} isn't a valid city!`;
    info_text.classList.replace("pending", "error");
  } else {
    info_text.classList.replace("error", "pending");
    wrapper.classList.add("active");

    const { temp, humidity, feels_like } = info.main;
    const { id, main, description } = info.weather[0];
    const city = info.name;
    const country = info.sys.country;

    if (id === 800) {
      weather_Icons.src = "assets/img/clear.png";
    } else if (id >= 200 && id <= 232) {
      weather_Icons.src = "assets/img/strom.png";
    } else if (id >= 300 && id <= 321) {
      weather_Icons.src = "assets/img/rain.png";
    } else if (id >= 500 && id <= 531) {
      weather_Icons.src = "assets/img/rain.png";
    } else if (id >= 600 && id <= 622) {
      weather_Icons.src = "assets/img/snow.png";
    } else if (id >= 701 && id <= 781) {
      weather_Icons.src = "assets/img/haze.png";
    } else if (id >= 801 && id <= 804) {
      weather_Icons.src = "assets/img/cloud.png";
    }

    wrapper.querySelector(".weather_part .temp .numb").innerHTML =
      Math.floor(temp);
    wrapper.querySelector(".weather_part .weather").innerHTML = description;
    wrapper.querySelector(
      ".weather_part .location span"
    ).innerHTML = `${city} - ${country}`;
    wrapper.querySelector(".weather_part .fells .number").innerHTML =
      Math.floor(feels_like);
    wrapper.querySelector(".weather_part .humidity .numb").innerHTML = humidity;
  }
}

arrow_Back.addEventListener("click", function () {
  input_Field.value = "";
  wrapper.classList.remove("active");
  info_text.innerHTML = `${input_Field.value} isn't a valid city!`;
  info_text.classList.remove("pending");
});
