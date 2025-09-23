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
























  function renderNewsApp() {
    document.querySelector(".calendar-app").classList.remove("fade-out");
    document.querySelector(".calendar-app").classList.add("fade-in");
    document.querySelector(".events-container").classList.remove("weather-app");
    let lang = "ru";
    let theme = "world";



    const renderHeaderBtn = () => {
      const header = document.createElement("div");
      header.classList.add("header-right");
      header.innerHTML = `
            <div  class ="language-switcher" >
                <button id="ru" class="btnNews active">RU</button>
                <button id="en" class="btnNews">EN</button>
            </div> 
            <div class="menu-container">
              <button class="menu-btn">Темы</button>
              <div class="dropdown-content">
                <a class ="themeNews" id = "general" href="#">Общее</a>
                <a class ="themeNews" id = "world" href="#">Мир</a>
                <a class ="themeNews" id = "nation" href="#">Страна</a>
                <a class ="themeNews" id = "business" href="#">Бизнес</a>
                <a class ="themeNews" id = "technology" href="#">Технологии</a>
                <a class ="themeNews" id = "entertainment" href="#">Развлечения</a>
                <a class ="themeNews" id = "sports" href="#">Спорт</a>
                <a class ="themeNews" id = "science" href="#">Наука</a>
                <a class ="themeNews" id = "health" href="#">Здоровье</a>
              </div>
            </div>


          `;
      document.querySelector(".header").prepend(header);

    };
    renderHeaderBtn();


    const newsCarusel = () => {
      const main = document.createElement("main");
      main.innerHTML = `
                <h2 class="carousel-title" > Главные новости</h2 >
                <div class="news-carousel">  
                </div>`;
      document.querySelector(".wraper-nav-cal").prepend(main);
    };
    newsCarusel();

    const newsList = () => {

      const lastNewsTag = document.createElement("div");
      lastNewsTag.innerHTML = `
              <h2 class="carousel-title news-list-title" > Последние новости</h2 >
                <div class="news-list">
                </div>
            `;
      document.querySelector(".events-container").append(lastNewsTag);
    };
    newsList();

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

    function carousel(lang, theme) {
      let apikey = '4544cbf01dd600064686b8125853d3c5';
      let category = theme;
      let url = 'https://gnews.io/api/v4/top-headlines?category=' + category + `&lang=${lang}&country=${lang}&max=10&apikey=` + apikey;

      fetch(url)
        .then(response => response.json())
        .then((data) => {
          const articles = Object.values(data.articles);
          for (let value of articles) {
            let { title, description, url, image } = value;
            const cardNews = new NewsCard(title, description, url, image);
            cardNews.renderCarusel();
            newsLink(".news-card");

          }
        });
    };
    carousel(lang, theme)

    function lastNews(lang) {
      let apikey = '4544cbf01dd600064686b8125853d3c5';
      let category = theme;
      let url = 'https://gnews.io/api/v4/top-headlines?category=' + category + `&lang=${lang}&country=${lang}&max=10&apikey=` + apikey;

      fetch(url)
        .then(response => response.json())
        .then((data) => {
          document.querySelector(".events-container").classList.add("mews-conteiner");
          const articles = Object.values(data.articles);
          for (let value of articles) {
            let { title, description, url, image } = value;
            const cardNews = new NewsCard(title, description, url, image);
            cardNews.renderLastNews();
            newsLink(".news-item");
          };
        });
    };
    lastNews(lang);

    function activeBtnLang(lang, theme) {
      const btn = document.querySelectorAll(".btnNews");
      btn.forEach(item => {
        item.addEventListener("click", event => {
          if (event.target == item) {
            btn.forEach(item => {
              item.classList.remove("active");
            });
            item.classList.add("active");
            lang = item.id;
            document.querySelector(".news-carousel").innerHTML = "";
            document.querySelector(".news-list").innerHTML = "";
            carousel(lang, theme);
            lastNews(lang);

          };
        });

      });

    };
    activeBtnLang();

    function newsLink(selector) {
      document.querySelectorAll(selector).forEach(item => {
        item.addEventListener("click", event => {
          if (event.currentTarget == item) {
            window.open(item.id, "_blank");
          }
        });
      });

    };


    function setThemeNews(lang, theme) {
      document.querySelectorAll(".themeNews").forEach(item => {
        item.addEventListener("click", event => {
          if (event.target == item) {
            theme = item.id;
            document.querySelector(".news-carousel").innerHTML = "";
            carousel(lang, theme);
            console.log(lang, theme);

          };

        });
      });



    };
    setThemeNews(lang, theme);







  };


































});