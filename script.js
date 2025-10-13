"use strict";


document.addEventListener('DOMContentLoaded', () => {

  function renderToDo() {

    document.querySelector(".calendar-app").classList.remove("fade-out");
    document.querySelector(".calendar-app").classList.add("fade-in");
    if (document.querySelector(".modal")) {
      document.querySelector(".modal").remove()
    };


    if (document.querySelector(".events-container").classList.contains("mews-conteiner")) {
      document.querySelector(".events-container").classList.remove("mews-conteiner");

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
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formObj = {};
      let formData = new FormData(form);
      formData.forEach((item, index) => {
        formObj[index] = item;
      });
      localStorage.setItem(Date.now(), JSON.stringify(formObj));
      modal.classList.remove("fade-in");
      modal.classList.add("fade-out");
      setTimeout(renderToDo, 1000);
    });


    // добавляем обработчик на кнопку "добавить событие"
    addBtn.addEventListener("click", () => {
      modal.style.display = "block";
      modal.classList.add("fade-in");
    });



    //  создаем класс "событие и его метод" 
    class Todo {
      constructor(id, date, time, item, content, priority) {
        this.id = id
        this.date = date
        this.time = time
        this.item = item
        this.content = content
        this.priority = priority

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
              event.classList.add("event-card");
              if (this.priority == "low") {
                event.classList.add("low")
              } else if (this.priority == "medium") {
                event.classList.add("medium")
              } else if (this.priority == "high") {
                event.classList.add("high")
              }
              event.innerHTML = `<span class="event-title">${this.item}</span>
                    <span class="event-details">${this.content}</span>
                    <span class="event-time">${this.time}</span>
                    <div class="delete-btn-events">
                    <img src="../icons/free-icon-delete-11502841.PNG" alt="Удалить" class="detail-icon">
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
        if (!parseInt(id)) {
          continue
        } else {
          let n = JSON.parse(localStorage.getItem(id));
          let { date, item, content, time, priority } = n;
          let t = +(time.slice(0, 2));
          for (let i of oursArr) {
            if (t == i) {
              const newEvent = new Todo(id, date, time, item, content, priority);
              newEvent.rederToDo();
              deletEvent();
            }
          };

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
                        <textarea class="modal__input__textarea" required placeholder="Что нужно сделать..." name="content" type="text" class="modal__cont"></textarea>
                        <div class="check">
                        <div >
                          <input type="radio" id="high-priority" name="priority" value="high" checked>
                          <label for="high-priority">Очень важно</label>
                        </div>
                        <div>
                          <input type="radio" id="medium-priority" name="priority" value="medium">
                          <label for="medium-priority">Важно</label>
                        </div>
                        <div>
                          <input type="radio" id="low-priority" name="priority" value="low">
                          <label for="low-priority">Неважно</label>
                        </div>
                        </div>
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
    if (document.querySelector(".events-container").classList.contains("mews-conteiner")) {
      document.querySelector(".events-container").classList.remove("mews-conteiner");

    };
    document.querySelector(".calendar-app").classList.remove("fade-out");
    document.querySelector(".calendar-app").classList.add("fade-in");
    document.querySelector(".events-container").classList.add("weather-app");

    fetch("http://api.weatherapi.com/v1/forecast.json?key=ae8e436780834047a53182801251309&q=Petrozavodsk&days=7&aqi=no&alerts=no")
      .then(data => data.json())
      .then(json => {
        console.log(json);
        getData(json);
        dayWeatherCard(json);
      });




    // создаем класс карточек прогноза по дням
    class RenderDayCard {
      constructor(date, avgtemp_c, icon) {
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
        let { icon } = item.day.condition;
        console.log(item);
        let card = new RenderDayCard(date, avgtemp_c, icon);
        card.render();
      }
      // Добавляем обработчик на карточки
      addEventListenerDayCard(nam);
    };

    // обрабатываем данные с сервера для Header и Conteiner
    function getData(nam) {
      let { name } = nam.location;
      let { humidity, wind_kph, pressure_mb, temp_c, wind_dir, is_day } = nam.current;
      // рендерим Header
      headerWeather(temp_c, name);
      // рендерим Conteiner
      renderWatherConteiner(humidity, wind_kph, pressure_mb, wind_dir, is_day);

    }

    // функция для получения дня недели по индексу
    function getDayOfWeek(nam) {
      let n;
      const week = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
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
    function renderWatherConteiner(humidity, wind_kph, pressure_mb, wind_dir, is_day) {

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
                <img src="icons/weather/Gemini_Generated_Image_cdokd2cdokd2cdok-Photoroom.PNG" alt="Облачно с солнцем">
            </div>
            <section class="weekly-forecast" 
            </section>
`;
    };
    // функция для меню подробного прогноза по дням
    function renderDetailedDay(nam, id) {

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

  function renderShopsCheck() {
    if (document.querySelector(".events-container").classList.contains("mews-conteiner")) {
      document.querySelector(".events-container").classList.remove("mews-conteiner");

    };
    document.querySelector(".calendar-app").classList.remove("fade-out");
    document.querySelector(".calendar-app").classList.add("fade-in");
    document.querySelector(".events-container").classList.remove("weather-app")
    document.querySelector(".events-container").innerHTML = `
    <h1 class="lu-title">Список покупок</h1>
    <ul class="ul-List"></ul>
`;
    const divInputShops = document.createElement("div");
    divInputShops.classList.add("divInputShops");
    divInputShops.innerHTML = `
    <form class="shopping-form">
  <h2>Что сегодня купим?</h2>
  <div class="input-group">
    <input type="text" id="new-item" name="item" placeholder="Что нужно купить.">
    <button type="submit">Добавить</button>
  </div>
</form>
  `;
    document.querySelector(".header").prepend(divInputShops);

    const form = document.querySelector(".shopping-form");
    form.addEventListener("submit", event => {
      event.preventDefault();
      let formData = new FormData(form);
      formData.forEach((item) => {
        localStorage.setItem(`shops:${Date.now()}`, `${item}`);
      });
      renderByItem();
      addCheckStyle();
      form.reset();
    });

    function renderByItem() {
      document.querySelector(".ul-List").innerHTML = "";
      const localStorageKeys = Object.keys(localStorage);
      for (let item of localStorageKeys) {
        if (item.slice(0, 5) == "shops") {
          const li = document.createElement("li");
          li.classList.add("shops__item");
          li.id = item;
          li.innerHTML = `
          <span class="item-text">${localStorage.getItem(item)}</span>
          <input type="checkbox" class="checkbox">
          <img src="icons/delete.PNG" alt="Удалить" class="delete-icon">
          `;
          document.querySelector(".ul-List").append(li);

        };

      };
      deleteShopsItem();
    };

    renderByItem();

    function addCheckStyle() {
      document.querySelectorAll(".checkbox").forEach(item => {
        item.addEventListener("click", event => {
          event.target.parentElement.classList.toggle("check-shops");
          checkAll();



        })
      })
    };
    addCheckStyle();

    function checkAll() {
      let n = 0;
      document.querySelectorAll(".checkbox").forEach(item => {
        if (item.checked == true) {
          n++
        } else {
          n--
        }

      })
      if (n == document.querySelectorAll(".checkbox").length) {
        removeShopsList()

      }
    };

    function removeShopsList() {
      const div = document.createElement("div");
      div.classList.add("container-shops-list");
      div.classList.add("fade-in");
      div.innerHTML = `
      <p class="message">Вы всё купили</p>
      <div class="buttons">
        <button class="btn btn-delete">Удалить список</button>
        <button class="btn btn-cancel">Отмена</button>
      </div>
`;
      document.querySelector(".ul-List").prepend(div);
      document.querySelector(".btn-delete").addEventListener("click", () => {
        const localStorageKeys = Object.keys(localStorage);
        for (let item of localStorageKeys) {
          if (item.slice(0, 5) == "shops") {
            localStorage.removeItem(item);
          }
        }
        div.classList.remove("fade-in");
        div.classList.add("fade-out");
        setTimeout(renderByItem, 1500);
      })
      document.querySelector(".btn-cancel").addEventListener("click", () => {
        div.classList.remove("fade-in");
        div.classList.add("fade-out");

        setTimeout(() => {
          document.querySelector(".container-shops-list").remove()
        }, 2000)
        // renderByItem();
        // addCheckStyle();


      })

    }
    function deleteShopsItem() {
      const btnDeletShops = document.querySelectorAll(".delete-icon");
      btnDeletShops.forEach(item => {
        item.addEventListener("click", event => {
          if (event.target == item) {

            localStorage.removeItem(item.parentElement.id);
            renderByItem()
            addCheckStyle()
          }
        })
      });
    }
























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
          setTimeout(renderToDo, 1000);

        } else if (event.target.id == "Weather" || event.target.id == "WeatherIMG") {
          document.querySelector(".calendar-app").classList.remove("fade-in");
          document.querySelector(".calendar-app").classList.add("fade-out");
          document.querySelector("#Weather").classList.add("active");
          setTimeout(clearApp, 1000);
          setTimeout(renderWather, 1000);

        } else if (event.target.id == "CheckList" || event.target.id == "CheckListIMG") {
          document.querySelector(".calendar-app").classList.remove("fade-in");
          document.querySelector(".calendar-app").classList.add("fade-out");
          document.querySelector("#CheckList").classList.add("active");
          setTimeout(clearApp, 1000);
          setTimeout(renderShopsCheck, 1000);

        } else if (event.target.id == "News" || event.target.id == "NewsIMG") {
          document.querySelector(".calendar-app").classList.remove("fade-in");
          document.querySelector(".calendar-app").classList.add("fade-out");
          document.querySelector("#News").classList.add("active");
          setTimeout(clearApp, 1000);
          setTimeout(renderNewsApp, 1000);

        }
      }
    });
  });





  function clearApp() {
    document.querySelector(".header").innerHTML = "";
    document.querySelector(".events-container").innerHTML = "";
    document.querySelector(".wraper-nav-cal").innerHTML = "";
  };
















  // general, world, nation, business, technology, entertainment, sports, science and health.















  const obj = {

    information: {
      realTimeArticles: {
        message: 'Real-time news data is only available on paid plans. Free plan has a 12-hour delay. Upgrade your plan here to remove the delay: https://gnews.io/change-plan'
      }
    },
    totalArticles: 224598,
    articles: [
      {
        id: '145dda464834624cd3ea459265e401ed',
        title: 'Балтия лишилась военной поддержки США, - Reuters',
        description: 'США намерены пересмотреть приоритеты военной помощи странам Балтии, что вызывает тревогу среди европейских дипломатов и экспертов по безопасности....',
        content: 'В конце августа представители Пентагона на встрече с европейскими дипломатами заявили о планах ограничить поддержку в сфере безопасности Латвии, Литвы и Эстонии. Чиновник Дэвид Бейкер подчеркнул, что Европе необходимо снизить зависимость от США, а ам... [1422 chars]',
        url: 'https://www.rbc.ua/ukr/news/tramp-skorochue-viyskovu-dopomogu-latviyi-1758422849.html',
        image: 'https://www.rbc.ua/static/img/_/g/_gettyimages_2204103483__1__bad664a7c82a12a29584baaca6963351_1300x820.jpg',
        publishedAt: '2025-09-21T03:10:00Z',
        lang: 'ru',
        source: {
          id: '6f1ead09126f1f4738a48957e22f789c',
          name: 'РБК-Україна',
          url: 'https://www.rbc.ua',
          country: 'ua'
        }
      },
      {
        id: '1139cf8acb42f9663be7d8f18a1b125c',
        title: 'Иран заявил, что приостанавливает сотрудничество с МАГАТЭ',
        description: 'Высший совет национальной безопасности Ирана (ВСНБ) заявил, что после необдуманных шагов, предпринятых европейскими странами против Тегерана, сотрудничество с Международным агентством по атомной энергии (МАГАТЭ) будет приостановлено.',
        content: 'Высший совет национальной безопасности Ирана (ВСНБ) заявил, что после "необдуманных" шагов, предпринятых европейскими странами против Тегерана, сотрудничество с Международным агентством по атомной энергии (МАГАТЭ) будет приостановлено.\n' +
          'Источник: полу... [1629 chars]',
        url: 'https://www.pravda.com.ua/rus/news/2025/09/21/7531779/',
        image: 'https://img.pravda.com/images/doc/7/5/7531779_fb_image_rus_2025_09_21_06_07_49.jpg',
        publishedAt: '2025-09-21T03:04:56Z',
        lang: 'ru',
        source: {
          id: '6f1ead09126f1f4738a48957e22f789c',
          name: 'РБК-Україна',
          url: 'https://www.rbc.ua',
          country: 'ua'
        }
      },
      {
        id: '631bf2f616eb4e849ed91e8df4c2a193',
        title: 'Сегодня 21 сентября: какой праздник и день в истории',
        description: '21 сентября в Украине – Всенародный день отца и День работника леса. Также сегодня – Международный день мира',
        content: '21 сентября в Украине – Всенародный день отца и День работника леса. Также сегодня – Международный день мира. В этот день в 2022-м российский диктатор Путин объявил «частичную мобилизацию». В 1991-м в Армении состоялся референдум за независимость и в... [4500 chars]',
        url: 'https://www.objectiv.tv/objectively/2025/09/21/segodnya-21-sentyabrya-kakoj-prazdnik-i-den-v-istorii-3/',
        image: 'https://www.objectiv.tv/wp-content/uploads/2025/09/21-VERESNYA-scaled.jpg',
        publishedAt: '2025-09-21T03:00:00Z',
        lang: 'ru',
        source: {
          id: '6f1ead09126f1f4738a48957e22f789c',
          name: 'РБК-Україна',
          url: 'https://www.rbc.ua',
          country: 'ua'
        }
      },
      {
        id: '7b3303f579551abd2afa9f98beb1db75',
        title: 'Великобритания введет санкции против ХАМАС вместе с признанием Палестины',
        description: 'EADaily, 21 сентября 2025. Премьер-министр Великобритании Кир Стармер введет новые санкции против ХАМАС, параллельно намереваясь признать Палестинское государство, передает Telegraph.',
        content: 'Премьер-министр Великобритании Кир Стармер введет новые санкции против ХАМАС, параллельно намереваясь признать Палестинское государство, передает Telegraph.\n' +
          'Стармер планирует сделать заявление по поводу ХАМАС 21 сентября, пишет издание.\n' +
          'Его подход бу... [836 chars]',
        url: 'https://eadaily.com/ru/news/2025/09/21/velikobritaniya-vvedet-sankcii-protiv-hamas-vmeste-s-priznaniem-palestiny',
        image: 'https://img5.eadaily.com/r650x400/o/407/09d602148cd305585a500ceedcb7e.jpeg',
        publishedAt: '2025-09-21T02:50:00Z',
        lang: 'ru',
        source: {
          id: '6f1ead09126f1f4738a48957e22f789c',
          name: 'РБК-Україна',
          url: 'https://www.rbc.ua',
          country: 'ua'
        }
      },
      {
        id: '3121497ec7de2d214635a7a76f56ff0b',
        title: 'Энергичность Овнов, триумф Весов и истощение Рыб: подробный гороскоп на 22 сентября',
        description: 'Понедельник, 22 сентября, пройдет под влиянием Луны. В этот день важно сохранять внутренний баланс и не торопиться с принятием важных решений. Энергия дня поможет лучше понять собственные чувства и мягко начать рабочую неделю, пишет ИА PrimaMedia.',
        content: 'Понедельник, 22 сентября, пройдет под влиянием Луны. В этот день важно сохранять внутренний баланс и не торопиться с принятием важных решений. Энергия дня поможет лучше понять собственные чувства и мягко начать рабочую неделю, пишет ИА PrimaMedia.\n' +
          'Ов... [1969 chars]',
        url: 'https://primamedia.ru/news/2228547/',
        image: 'https://primamedia.ru/f/main/5632/5631943.png?609e26fa5c98c8c2c300a2e32697308d',
        publishedAt: '2025-09-21T02:09:11Z',
        lang: 'ru',
        source: {
          id: '6f1ead09126f1f4738a48957e22f789c',
          name: 'РБК-Україна',
          url: 'https://www.rbc.ua',
          country: 'ua'
        }
      },
      {
        id: 'e5c9f8ff410ddfeb62612480340ebdb7',
        title: 'Финансовая удача в конце сентября: три знака зодиака получат неожиданные доходы',
        description: 'Конец сентября принесет с собой мощные финансовые изменения, которые коснутся сразу нескольких знаков зодиака. Астрологи отмечают, что этот период станет временем приятных сюрпризов, денежных поступлений и выгодных возможностей.',
        content: 'Конец сентября принесет с собой мощные финансовые изменения, которые коснутся сразу нескольких знаков зодиака. Астрологи отмечают, что этот период станет временем приятных сюрпризов, денежных поступлений и выгодных возможностей. Звезды откроют двери ... [1944 chars]',
        url: 'https://www.obozrevatel.com/novosti-obschestvo/finansovaya-udacha-v-kontse-sentyabrya-tri-znaka-zodiaka-poluchat-neozhidannyie-dohodyi.htm',
        image: 'https://i.obozrevatel.com/news/2024/7/25/50eb7fe4-04ce-4188-a721-0395ffa9696b.png?size=1200x630',
        publishedAt: '2025-09-21T02:03:00Z',
        lang: 'ru',
        source: {
          id: '6f1ead09126f1f4738a48957e22f789c',
          name: 'РБК-Україна',
          url: 'https://www.rbc.ua',
          country: 'ua'
        }
      },
      {
        id: '5292e6105c3f953942a73b77328dbc9d',
        title: 'В России жестко отреагировали на призыв экс-украинских властей "идти на Москву"',
        description: 'Ранее на Украине призвали «идти на Москву»',
        content: 'Ранее на Украине призвали «идти на Москву» Фото: Создано в Midjourney © URA.RU\n' +
          'новость из сюжета\n' +
          'Спецоперация РФ на Украине\n' +
          'Бывший президент Украины Виктор Ющенко — ужасный трус и предатель. Об этом сообщил депутат Госдумы от Крыма Михаил Шеремет, ко... [3957 chars]',
        url: 'https://ura.news/news/1052998892',
        image: 'https://s.ura.news/images/news/figures/591/514/520e0c47-fd5f-4867-8040-7a66463d4542/zrk0il/L-1200.1.9.jpg',
        publishedAt: '2025-09-21T01:38:50Z',
        lang: 'ru',
        source: {
          id: '6f1ead09126f1f4738a48957e22f789c',
          name: 'РБК-Україна',
          url: 'https://www.rbc.ua',
          country: 'ua'
        }
      },
      {
        id: 'ab0831938fc77c43910bbea9d3fcc917',
        title: 'Народные методы лечения ОРВИ: какие оправданы, а какие опасны - 21 сентября 2025',
        description: 'Наступивший сезон простуд и ОРВИ для многих — повод вспомнить бесценные бабушкины рецепты, с помощью которых нас когда-то - Здоровье - 21 сентября 2025 | 74.ру',
        content: 'Наступивший сезон простуд и ОРВИ для многих — повод вспомнить бесценные бабушкины рецепты, с помощью которых нас когда-то лечили в детстве. Кому не сыпали в носки горчицу и не рисовали на груди йодную сеточку? Мы обсудили эффективность таких методов ... [5745 chars]',
        url: 'https://74.ru/text/health/2025/09/21/76037027/',
        image: 'https://74.ru/html-to-img/og/MNSZF57qFxyw2CHr4X7Gwg/article-id6561353-16x9.jpg?1758363118',
        publishedAt: '2025-09-21T01:30:00Z',
        lang: 'ru',
        source: {
          id: '6f1ead09126f1f4738a48957e22f789c',
          name: 'РБК-Україна',
          url: 'https://www.rbc.ua',
          country: 'ua'
        }
      },
      {
        id: 'aef68f836288c1746237b1bc08c6bc58',
        title: 'Трамп хочет вернуть авиабазу Bagram и пригрозил Афганистану',
        description: 'Президент США Дональд Трамп заявил, что случятся плохие вещи, если Афганистан не вернет Штатам авиабазу Bagram.',
        content: 'Президент США Дональд Трамп заявил, что случятся "плохие вещи", если Афганистан не вернет Штатам авиабазу Bagram.\n' +
          'Источник: Трамп в своей соцсети Truth Social, "Радио Свобода"\n' +
          'Прямая речь Трампа: "Если Афганистан не вернет авиабазу Bagram тем, кто ее... [1105 chars]',
        url: 'https://www.pravda.com.ua/rus/news/2025/09/21/7531777/',
        image: 'https://img.pravda.com/images/doc/7/5/7531777_fb_image_rus_2025_09_21_04_13_54.jpg',
        publishedAt: '2025-09-21T01:08:56Z',
        lang: 'ru',
        source: {
          id: '6f1ead09126f1f4738a48957e22f789c',
          name: 'РБК-Україна',
          url: 'https://www.rbc.ua',
          country: 'ua'
        }
      },
      {
        id: 'ae93d9bd50190516336ef46103abd3ff',
        title: 'Вучич заявил об "охоте" Запада из-за новостей о приезде Лаврова',
        description: 'Западные страны сочли скандалом информацию о возможном приезде в Белград министра иностранных дел России Сергея Лаврова на военный парад 20 сентября. Об этом сообщил президент Сербии Александр Вучич, передает РБК',
        content: 'Западные страны сочли скандалом информацию о возможном приезде в Белград министра иностранных дел России Сергея Лаврова на военный парад 20 сентября. Об этом сообщил президент Сербии Александр Вучич, передает РБК.\n' +
          'По его словам, из-за незнания лидеро... [322 chars]',
        url: 'https://tve24.ru/news/2025/09/21/vuchich-zayavil-ob-ohote-zapada-iz-za-novostey-o-priezde-lavrova/',
        image: 'https://icdn.lenta.ru/images/2025/09/21/04/20250921040753801/share_ee636589bc3f931a5b39a239db5d0c37.jpg',
        publishedAt: '2025-09-21T01:08:00Z',
        lang: 'ru',
        source: {
          id: '6f1ead09126f1f4738a48957e22f789c',
          name: 'РБК-Україна',
          url: 'https://www.rbc.ua',
          country: 'ua'
        }
      }
    ]

  };








  function renderNewsApp() {
    document.querySelector(".calendar-app").classList.remove("fade-out");
    document.querySelector(".calendar-app").classList.add("fade-in");
    document.querySelector(".events-container").classList.remove("weather-app");
    function renderHeaderBtn() {
      const header = document.createElement("div");
      header.classList.add("header-right");
      header.innerHTML = `
            <div div class ="language-switcher" >
                <button class="active">RU</button>
                <button>EN</button>
            </div >
            <div class="menu-container">
              <button class="menu-btn">Темы</button>
              <div class="dropdown-content">
                <a href="#">Общее</a>
                <a href="#">Мир</a>
                <a href="#">Страна</a>
                <a href="#">Бизнес</a>
                <a href="#">Технологии</a>
                <a href="#">Развлечения</a>
                <a href="#">Спорт</a>
                <a href="#">Наука</a>
                <a href="#">Здоровье</a>
              </div>
            </div>


          `;
      document.querySelector(".header").prepend(header);
    };
    renderHeaderBtn();


    const main = document.createElement("main");
    main.innerHTML = `
              <h2 class="carousel-title" > Главные новости</h2 >
              <div class="news-carousel">  
              </div>`;
    document.querySelector(".wraper-nav-cal").prepend(main);


    const lastNewsTag = document.createElement("div");
    lastNewsTag.innerHTML = `
            <h2 class="carousel-title news-list-title" > Последние новости</h2 >
              <div class="news-list">
              </div>
          `;
    document.querySelector(".events-container").append(lastNewsTag);



    class NewsCard {
      constructor(title, description, url, image) {
        this.title = title
        this.description = description
        this.image = image
        this.url = url
      }
      renderCarusel() {
        const carousel = document.createElement("div");
        carousel.classList.add("news-card");
        carousel.id = this.url;
        carousel.innerHTML = `
                  <img src=${this.image} alt=>
                    <div class="card-content">
                      <h3>${this.title}</h3>
                      <p>${this.description}</p>
                    </div>
          `;
        document.querySelector(".news-carousel").append(carousel);
      }
      renderLastNews() {
        const lastNews = document.createElement("div");
        lastNews.id = this.url;
        lastNews.classList.add("news-item");
        lastNews.innerHTML = `
                  <img src=${this.image} alt="Изображение новости">
                    <div class="item-content">
                      <h4>${this.title}</h4>
                      <p></p>
                    </div>
  `;
        document.querySelector(".news-list").prepend(lastNews);
      }
    };

    let apikey = '4544cbf01dd600064686b8125853d3c5';
    let category = 'technology';
    let url = 'https://gnews.io/api/v4/top-headlines?category=' + category + '&lang=ru&country=rus&max=10&apikey=' + apikey;

    fetch(url)
      .then(response => response.json())
      .then((data) => {
        carousel(data);
        lastNews(data);
      });



    function carousel(responce) {
      const articles = Object.values(responce.articles);
      for (let value of articles) {
        let { title, description, url, image } = value;
        const cardNews = new NewsCard(title, description, url, image);
        cardNews.renderCarusel();
      }
    };




    function lastNews(responce) {
      document.querySelector(".events-container").classList.add("mews-conteiner");
      const articles = Object.values(responce.articles);
      for (let value of articles) {
        let { title, description, url, image } = value;
        const cardNews = new NewsCard(title, description, url, image);
        cardNews.renderLastNews();
      };
    };
  }


































  });