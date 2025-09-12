"use strict";

document.addEventListener('DOMContentLoaded', () => {

function ToDoList () {
 const calendarWeek = document.querySelector('.week-days');
  const currentMonthYearHeader = document.querySelector('.date-text');
  const prevWeekBtn = document.getElementById('prev-week-btn');
  const nextWeekBtn = document.getElementById('next-week-btn');
  let oursArr = [];
  renderModal();
  renderTimLine(new Date().getHours());

  let currentDate = new Date();

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

    const cardDays = document.querySelectorAll(".day-card");

    cardDays.forEach(item => {
      item.addEventListener("click", event => {
        cardDays.forEach(item => {
          item.classList.remove("active");
        });
        if (event.target === item) {
          item.classList.add("active");
        }
      });
    });
  };

  const getStartOfWeek = (date) => {
    const dayOfWeek = date.getDay(); // 0 = Воскресенье, 1 = Понедельник
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Корректируем для начала недели с понедельника
    return new Date(date.setDate(diff));
  };

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
  }


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
                    <span class="time-label">11:30</span>
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
  const btnClose = document.querySelector(".modal__close");
  const parentDiv = document.querySelector(".event");


  form.addEventListener('submit', event => {
    event.preventDefault();
    const formObj = {};
    let formData = new FormData(form);
    formData.forEach((item, index) => {
      formObj[index] = item;
    });
    localStorage.setItem(Date.now(), JSON.stringify(formObj));
    modal.style.display = "none";
    parentDiv.innerHTML = "";
    getLocalDB();
    form.reset();
  });

  addBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });




  class Todo {
    constructor(id, date, time, item, content) {
      this.id = id
      this.date = date
      this.time = time
      this.item = item
      this.content = content

    }

    rederToDo() {
      const timeLine = document.querySelectorAll(".time-line");
      const sliceTime = this.time.slice(0, 2);
      timeLine.forEach(item => {
        if (item.id == addZerro(+sliceTime)) {
           console.log(item.id == addZerro(+sliceTime));
          const event = document.createElement(`div`);
          event.id = `${this.id}`;
          event.classList.add("event-card", "training");
          event.innerHTML = `<span class="event-title">${this.item}</span>
                    <span class="event-details">${this.content}</span>
                    <span class="event-time">${this.time}</span>
                    `;

          item.children[1].append(event);
        }

      })



    };
  };
  function getLocalDB() {
    const localObj = Object.keys(localStorage);


    for (let id of localObj) {
      if (typeof (+id) == "number") {
        let n = JSON.parse(localStorage.getItem(id));
        let { data, item, content, time } = n;
        const newEvent = new Todo(id, data, time, item, content);
        let t = +(time.slice(0, 2));
        for (let i of oursArr) {
          if (t == i) {
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




};
 
ToDoList()


















































});