"use strict";


document.addEventListener('DOMContentLoaded', () => {
  function clearApp() {
    document.querySelector(".header").innerHTML = "";
    document.querySelector(".events-container").innerHTML = "";
    document.querySelector(".wraper-nav-cal").innerHTML = "";
  };



  function renderToDo() {

    document.querySelector(".calendar-app").classList.remove("fade-out");
    document.querySelector(".calendar-app").classList.add("fade-in");
    if (document.querySelector(".modal")) {
      document.querySelector(".modal").remove()
    };



    document.querySelector(".events-container").classList.remove("weather-app")
    document.querySelector(".events-container").innerHTML = "";
    const wraperNavCal = document.querySelector(".wraper-nav-cal");
    createElementCalendar();
    const calendarWeek = document.querySelector('.week-days');
    const currentMonthYearHeader = document.querySelector('.date-text')
    const prevWeekBtn = document.getElementById('prev-week-btn');
    const nextWeekBtn = document.getElementById('next-week-btn');
    headerToDo();




    function createElementCalendar() {
      wraperNavCal.innerHTML = "";
      wraperNavCal.innerHTML = `
            <div class="date-display">
                <h1 class="date-text"></h1>
            </div>
            <div class="week-days"></div>
             <div class="arrow-down-container">
            <button id="prev-week-btn" class="btnPrev"> prev </button>
            <button id="next-week-btn" class="btnNext"> next </button>
             </div>
     `
    };



    let oursArr = [];
    renderModal();
    renderTimLine(new Date().getHours());

    let currentDate = new Date();



    //  создаем калндарь
    const renderCalendar = () => {
      calendarWeek.innerHTML = '';
      const startOfWeek = getStartOfWeek(currentDate);

      // Обновляем заголовок
      currentMonthYearHeader.textContent = startOfWeek.toLocaleDateString('ru-RU', {
        month: 'long',
        year: 'numeric'
      });

      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);

        const dayElement = document.createElement('div');
        dayElement.id = startOfWeek.getDate() + i;
        dayElement.classList.add('day-card');
        dayElement.id = `${JSON.stringify(day).slice(1, 11)}`;

        // Проверяем, является ли день текущим
        if (isSameDay(day, new Date())) {
          dayElement.classList.add('active');
        }

        // Добавляем день недели (например, 'Пн', 'Вт')
        const dayOfWeekSpan = document.createElement('span');
        dayOfWeekSpan.classList.add('day-name');
        dayOfWeekSpan.textContent = day.toLocaleDateString('ru-RU', { weekday: 'short' });
        dayElement.appendChild(dayOfWeekSpan);

        // Добавляем номер дня
        const dayNumberSpan = document.createElement('span');
        dayNumberSpan.classList.add('day-number');
        dayNumberSpan.textContent = day.getDate();
        dayElement.appendChild(dayNumberSpan);


        calendarWeek.appendChild(dayElement);

      }
      // Добавляем класс Activ на календарные дни
      const cardDays = document.querySelectorAll(".day-card");

      cardDays.forEach(item => {
        item.addEventListener("click", event => {

          cardDays.forEach(item => {
            item.classList.remove("active");
          });
          if (event.target === item) {
            item.classList.add("active");
            document.querySelectorAll(".event").forEach(item => {
              item.innerHTML = ""
            })
            getLocalDB();
            deletEvent();

          }
        });
      });
    };




    //  определяем начало недели
    const getStartOfWeek = (date) => {
      const dayOfWeek = date.getDay(); // 0 = Воскресенье, 1 = Понедельник
      const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Корректируем для начала недели с понедельника
      return new Date(date.setDate(diff));
    };
    // проверяем активную дату 
    const isSameDay = (d1, d2) => {
      return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
    };

    prevWeekBtn.addEventListener('click', () => {
      currentDate.setDate(currentDate.getDate() - 7);
      renderCalendar();
    });

    nextWeekBtn.addEventListener('click', () => {
      currentDate.setDate(currentDate.getDate() + 7);
      renderCalendar();
    });

    renderCalendar();


    function addZerro(nam) {
      if (nam < 10) {
        return `0${nam}`
      } else {
        return nam
      };
    };

    //  создаем временные точки
    function renderTimLine(hours) {
      const parentDivTime = document.querySelector('.events-container');
      for (let i = (hours - 5); i <= (hours + 5); i++) {
        const div = document.createElement("div");
        div.classList.add("time-line");
        if (i >= 24) {
          div.id = addZerro(i - 24);
          div.innerHTML = ` <span class="time-label">${addZerro(i - 24)}</span>
                          <div class="event"></div>
                `;
          parentDivTime.append(div);
          oursArr.push((i - 24));
        } else {
          div.id = i;
          div.innerHTML = ` <span class="time-label">${i}</span>
                          <div class="event"></div>
                `;
          parentDivTime.append(div);
          oursArr.push(i)
        };
      };
    }
    function renderCarrentTime(hours) {
      const timeLine = document.querySelectorAll(".time-line");
      const div = document.createElement("div");
      div.classList.add("time-line", "current-time");
      div.innerHTML = ` 
                    <span class="time-label"></span>
                    <div class="current-time-indicator"></div>
                `;
      timeLine.forEach(item => {
        if (item.id == hours)
          item.append(div);
      });
    };
    renderCarrentTime(new Date().getHours());

    const form = document.querySelector("form");
    const addBtn = document.getElementById("add-button");
    const modal = document.querySelector(".modal");


    //  вешаем обработчик событий на форму, данные с формы отправляем в localStorage  и снова рендерим страницу.
    form.addEventListener('submit', event => {

      event.preventDefault();
      const formObj = {};
      let formData = new FormData(form);
      formData.forEach((item, index) => {
        formObj[index] = item;
      });
      localStorage.setItem(Date.now(), JSON.stringify(formObj));
      modal.style.display = "none";
      renderToDo();
      form.reset();
    });


    // добавляем обработчик на кнопку "добавить событие"
    addBtn.addEventListener("click", () => {
      modal.style.display = "block";
    });



    //  создаем класс "событие и его метод" 
    class Todo {
      constructor(id, date, time, item, content) {
        this.id = id
        this.date = date
        this.time = time
        this.item = item
        this.content = content

      }
      //  создаем метод для rendera событий
      rederToDo() {


        document.querySelectorAll(".day-card").forEach(card => {
          const timeLine = document.querySelectorAll(".time-line");
          const sliceTime = this.time.slice(0, 2);
          timeLine.forEach(item => {

            if (item.id == +sliceTime && card.id == this.date && card.classList.contains("active")) {
              const event = document.createElement(`div`);
              event.id = `${this.id}`;
              event.classList.add("event-card", "training");
              event.innerHTML = `<span class="event-title">${this.item}</span>
                    <span class="event-details">${this.content}</span>
                    <span class="event-time">${this.time}</span>
                    <div class="delete-btn-events">
                    <img src="icons/free-icon-delete-11502841.PNG" alt="Удалить" class="detail-icon">
                    </div>
                    `;

              item.children[1].append(event);

            }
          })
        })




      };
    };


    // получаем обьект localStorage
    function getLocalDB() {
      const localObj = Object.keys(localStorage);

      // Проверяем localStorage на посторонние ключи, создаем новый "обьект собыий" и запускаем метод render
      for (let id of localObj) {
        if (typeof (+id) == "number") {
          let n = JSON.parse(localStorage.getItem(id));
          let { date, item, content, time } = n;
          let t = +(time.slice(0, 2));
          for (let i of oursArr) {
            if (t == i) {
              const newEvent = new Todo(id, date, time, item, content);
              newEvent.rederToDo();
            }
          };
        } else {
          continue
        };




      };

    };
    getLocalDB();

    function renderModal() {
      const modal = document.createElement("div");
      modal.classList.add("modal");
      modal.innerHTML = `
     <div class="modal__dialog">
                <div class="modal__content">
                    <form action="#">
                        <div class="modal__close">&times;</div>
                        <div class="modal__title">Добавить задачу</div>
                        <input required placeholder="Дата" name="date" type="date" class="modal__input">
                        <input required placeholder="Дата" name="time" type="time" class="modal__input">
                        <input required placeholder="Название" name="item" type="text" class="modal__input">
                        <textarea class="modal__input" required placeholder="Что нужно сделать..." name="content" type="text" class="modal__cont"></textarea>

                        <button class="btn btn_dark btn_min">Создать</button>
                    </form>
                </div>
     </div>`;
      document.body.append(modal);

    };




    // удаление события из localStorag
    function deletEvent() {
      const eventCard = document.querySelectorAll(".delete-btn-events");
      eventCard.forEach(item => {
        item.addEventListener("click", event => {
          if (event.target == item.children[0]) {
            localStorage.removeItem(item.parentElement.id);
            document.querySelectorAll(".event").forEach(item => {
              item.innerHTML = ""
            })
            getLocalDB();

          };

        });

      });

    };
    deletEvent();


    function setLocalTimeIndicator() {
      const addZerroSeconds = (nam) => {
        if (nam < 10) {
          return `0${nam}`
        } else {
          return nam
        };
      };


      if (document.querySelector(".time-line.current-time")) {
        const CarrentTime = (Date.now() + 10800000);
        const timeLabel = document.querySelector(".time-line.current-time");

        let hours = addZerroSeconds(Math.floor(((CarrentTime / (1000 * 60 * 60)) % 24))),
          minutes = addZerroSeconds(Math.floor(((CarrentTime / (1000 * 60)) % 60))),
          seconds = addZerroSeconds(Math.floor((CarrentTime / 1000) % 60));
        timeLabel.children[0].textContent = `${hours}:${minutes}:${seconds}`;
      };

    };
    setLocalTimeIndicator();
    setInterval(setLocalTimeIndicator, 1000);

    function headerToDo() {

      const header = document.querySelector(".header");
      header.innerHTML = `
                <div class="header-top">
                <button class="navbar-item">
                    <img src="icons/free-icon-calendar-1253979.png" alt="Настройки">
                </button>
            </div>
`;
    };

  };
  renderToDo();

  function renderWather() {
    document.querySelector(".calendar-app").classList.remove("fade-out");
    document.querySelector(".calendar-app").classList.add("fade-in");
    document.querySelector(".events-container").classList.add("weather-app");
    fetch("http://api.weatherapi.com/v1/forecast.json?key=ae8e436780834047a53182801251309&q=Petrozavodsk&days=7&aqi=no&alerts=no")
      .then(data => data.json())
      .then(json => {
        getData(json);
        dayWeatherCard(json);
      });


    // создаем класс карточек прогноза по дням
    class RenderDayCard {
      constructor(date, avgtemp_c,icon) {
        this.date = date
        this.avgtemp_c = avgtemp_c
        this.icon = icon
      }
      render() {

        const div = document.createElement("div");
        div.classList.add("forecast-day");
        div.innerHTML = `
                <span class="day-name">${this.date.slice(8.9)}</span>
                <img id= "${this.date}" src=${this.icon} alt class="forecast-icon">
                <span class="day-temp">${this.avgtemp_c}°C</span>
  `;
        document.querySelector(".weekly-forecast").append(div);

      }
    };


    // создаем и рендерим карточки по Классу 
    function dayWeatherCard(nam) {
      let { forecastday } = nam.forecast;
      for (let item of forecastday) {
        let { date } = item;
        let { avgtemp_c } = item.day;
        let {icon} = item.day.condition;
        console.log(item);
        let card = new RenderDayCard(date, avgtemp_c,icon);
        card.render();
      }
      // Добавляем обработчик на карточки
      addEventListenerDayCard(nam);
    };

    // обрабатываем данные с сервера для Header и Conteiner
    function getData(nam) {
      let { name } = nam.location;
      let { humidity, wind_kph, pressure_mb, temp_c, wind_dir, is_day } = nam.current;
      let {icon} = nam.current.condition;
      // рендерим Header
      headerWeather(temp_c, name);
      // рендерим Conteiner
      renderWatherConteiner(humidity, wind_kph, pressure_mb, wind_dir, is_day,icon);

    }

    // функция для получения дня недели по индексу
    function getDayOfWeek(nam) {
      let n;
      const week = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
      week.forEach((item, index) => {
        if (nam == index) {
          n = item
        }
      });
      return n;
    };


    // функция для рендера Header
    function headerWeather(temp, name) {
      const header = document.querySelector(".header");
      header.innerHTML = `
            <h1 class="city-name">${name}</h1>
            <div class="current-temp">
                <span class="temp-value">${temp}</span>
                <span class="temp-unit">°C</span>
            </div>
`;
    };

    //  функция для рендера Conteiner
    function renderWatherConteiner(humidity, wind_kph, pressure_mb, wind_dir, is_day,icon) {

      const wetherAPP = document.querySelector(".events-container");
      wetherAPP.innerHTML = `
            <div class="today-weather">
                <h2 class="today-day">${getDayOfWeek(is_day)}</h2>
                <div class="today-details">
                    <div class="detail-item">
                        <img src="icons/weather/free-icon-humidity-2435986.PNG" alt="Влажность" class="detail-icon">
                        <span>${humidity}%</span>
                    </div>
                    <div class="detail-item">
                        <img src="icons/weather/free-icon-wind-1007166.png" alt="Ветер" class="detail-icon">
                        <span>${wind_dir}, ${wind_kph} km/h</span>
                    </div>
                    <div class="detail-item">
                        <img src="icons/weather/free-icon-thermometer-3525808.PNG" alt="Давление" class="detail-icon">
                        <span>${pressure_mb}hPa</span>
                    </div>
                </div>
            </div>
            <div class="weather-graphic">
                <img src=${icon} alt="Облачно с солнцем">
            </div>
            <section class="weekly-forecast" 
            </section>
`;
    };
    // функция для меню подробного прогноза по дням
    function renderDetailedDay(nam, id) {


      console.log(nam);
      nam.forecast.forecastday.forEach(item => {
        if (id == item.date) {
          let { sunset, sunrise, moonset, moonrise } = item.astro,
            { avghumidity, avgtemp_c, maxtemp_c, maxwind_kph, mintemp_c, daily_chance_of_rain, totalprecip_mm, uv } = item.day;
            
                const modal = document.createElement("div");
      modal.classList.add("modal_weather");
      modal.innerHTML = `
      <div class="modal__dialog">
        <div class="weather-card">
          <div class="wave"></div>
          <div style="position: relative; z-index: 2;">
            <h2>Петрозаводск</h2>
            <p class="date">${id}</p>

            <div class="main-temp">
              ${avgtemp_c}<span>°C</span>
            </div>
            <p class="description">Переменная облачность</p>

            <div class="details-grid">
              <div class="detail-item">
                <div class="icon"><i class="fas fa-temperature-low"></i></div>
                <div class="value">Мин:${mintemp_c}°C</div>
                <div class="label">Температура</div>
              </div>
              <div class="detail-item">
                <div class="icon"><i class="fas fa-temperature-high"></i></div>
                <div class="value">Макс:${maxtemp_c}°C</div>
                <div class="label">Температура</div>
              </div>
              <div class="detail-item">
                <div class="icon"><i class="fas fa-wind"></i></div>
                <div class="value">${maxwind_kph}км/ч</div>
                <div class="label">Ветер</div>
              </div>
              <div class="detail-item">
                <div class="icon"><i class="fas fa-cloud-rain"></i></div>
                <div class="value">${daily_chance_of_rain}% | ${totalprecip_mm} мм</div>
                <div class="label">Осадки</div>
              </div>
              <div class="detail-item">
                <div class="icon"><i class="fas fa-water"></i></div>
                <div class="value">${avghumidity}%</div>
                <div class="label">Влажность</div>
              </div>
              <div class="detail-item">
                <div class="icon"><i class="fas fa-sun"></i></div>
                <div class="value">${uv} (Средний)</div>
                <div class="label">УФ-индекс</div>
              </div>
            </div>

            <div class="sun-moon-grid">
              <div class="sun-moon-item">
                <div class="icon"><i class="fas fa-sun"></i></div>
                <div class="time">${sunrise}</div>
                <div class="label">Восход</div>
              </div>
              <div class="sun-moon-item">
                <div class="icon"><i class="fas fa-sun"></i></div>
                <div class="time">${sunset}</div>
                <div class="label">Закат</div>
              </div>
              <div class="sun-moon-item">
                <div class="icon"><i class="fas fa-moon"></i></div>
                <div class="time">${moonrise}</div>
                <div class="label">Восход Луны</div>
              </div>
              <div class="sun-moon-item">
                <div class="icon"><i class="fas fa-moon"></i></div>
                <div class="time">${moonset}</div>
                <div class="label">Закат Луны</div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
      document.body.append(modal);
      modal.classList.add("fade-in");
      closeModal()
        }
      })






    };

    // функция для удаления муню подробного прогноза из Body
    function deleteModalDiv() {
      document.querySelector(".modal_weather").remove()
    }

    // функция для закрытия меню подробного дня
    function closeModal() {
      let modal = document.querySelector(".modal_weather");
      modal.addEventListener("click", event => {
        if (event.target == modal) {
          modal.classList.remove("fade-in");
          modal.classList.add("fade-out");
          setTimeout(deleteModalDiv, 1500);
        }
      })
    };


    // функция для добавления обработчика на каркточки дней для вызова меню подробного дня
    function addEventListenerDayCard(nam) {
      document.querySelectorAll(".forecast-icon").forEach(item => {
        item.addEventListener("click", event => {
          if (event.target == item) {
            renderDetailedDay(nam, item.id);



          }
        })
      })
    };
  };














  const BtnNavProject = document.querySelectorAll(".navbar-item");
  BtnNavProject.forEach(item => {
    item.addEventListener("click", event => {
      if (event.target || event.target.tagName == 'BUTTON' || event.target.tagName == 'IMG') {
        if (event.target.id == "ToDo" || event.target.id == "ToDoIMG") {

          document.querySelector(".calendar-app").classList.remove("fade-in");
          document.querySelector(".calendar-app").classList.add("fade-out");
          document.querySelector("#ToDo").classList.add("active");
          setTimeout(clearApp, 1000);
          setTimeout(renderToDo, 1500);



        } else if (event.target.id == "Weather" || event.target.id == "WeatherIMG") {
          document.querySelector(".calendar-app").classList.remove("fade-in");
          document.querySelector(".calendar-app").classList.add("fade-out");
          document.querySelector("#Weather").classList.add("active");
          setTimeout(clearApp, 1000);
          setTimeout(renderWather, 1500);



        } else if (event.target.id == "CheckList" || event.target.id == "CheckListIMG") {
          document.querySelector("#CheckList").classList.add("active");
          document.querySelector(".header").innerHTML = "";
          document.querySelector(".events-container").innerHTML = "";
          document.querySelector(".wraper-nav-cal").innerHTML = "";
          alert("Функционал будет позже")
        } else if (event.target.id == "News" || event.target.id == "NewsIMG") {
          document.querySelector("#News").classList.add("active");
          document.querySelector(".header").innerHTML = "";
          document.querySelector(".events-container").innerHTML = "";
          document.querySelector(".wraper-nav-cal").innerHTML = "";
          alert("Функционал будет позже")
        }
      }
    });
  });



















});