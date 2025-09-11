document.addEventListener('DOMContentLoaded', () => {
  const calendarWeek = document.querySelector('.week-days');
  const currentMonthYearHeader = document.querySelector('.date-text');
  const prevWeekBtn = document.getElementById('prev-week-btn');
  const nextWeekBtn = document.getElementById('next-week-btn');


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
        console.log(item.id)
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
    getLocalDB()
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
      const event = document.createElement(`div`);
      event.id = `${this.id}`;
      event.classList.add("event-card", "training");
      event.innerHTML = `<span class="event-title">${this.item}</span>
                    <span class="event-details">${this.content}</span>
                    <span class="event-time">${this.time}</span>
                    `;

      parentDiv.append(event)
      console.log(this.id);


    }

  };


  function getLocalDB() {
    const localObj = Object.keys(localStorage);
    for (it of localObj) {
      let n = JSON.parse(localStorage.getItem(it));
      let { data, item, content, time } = n;
      const newEvent = new Todo(it, data, time, item, content);
      newEvent.rederToDo();
      console.log(it);
    }

  };

  getLocalDB();
























































});