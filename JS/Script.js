document.addEventListener('DOMContentLoaded', () => {
    const calendarSection = document.getElementById('calendar');
    const eventFormSection = document.getElementById('event-form');
    const viewAnnualButton = document.getElementById('view-annual');
    const viewMonthlyButton = document.getElementById('view-monthly');
    const viewDailyButton = document.getElementById('view-daily');

    let events = [];

    function generateCalendar(view = 'monthly', specificDate = new Date()) {
        console.log(`Generando calendario en vista: ${view}`);
        calendarSection.innerHTML = '';

        const year = specificDate.getFullYear();
        const month = specificDate.getMonth();

        if (view === 'annual') {
            generateAnnualCalendar(year);
        } else if (view === 'monthly') {
            generateMonthlyCalendar(year, month);
        } else if (view === 'daily') {
            generateDailyCalendar(specificDate);
        }
    }

    function generateDaysOfWeekHeader() {
        const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const daysOfWeekHeader = document.createElement('div');
        daysOfWeekHeader.classList.add('calendar-grid');
        daysOfWeek.forEach(day => {
            const dayCell = document.createElement('div');
            dayCell.classList.add('calendar-day', 'day-header');
            dayCell.textContent = day;
            daysOfWeekHeader.appendChild(dayCell);
        });
        return daysOfWeekHeader;
    }

    function generateAnnualCalendar(year) {
        console.log(`Generando calendario anual para el año: ${year}`);
        const calendarContainer = document.createElement('div');
        calendarContainer.id = 'calendar-container';
        calendarContainer.classList.add('calendar-annual');
        calendarSection.appendChild(calendarContainer);

        for (let month = 0; month < 12; month++) {
            const monthContainer = document.createElement('div');
            monthContainer.classList.add('month-container');
            const monthName = getMonthName(month);
            monthContainer.innerHTML = `<h3>${monthName}</h3>`;
            calendarContainer.appendChild(monthContainer);

            monthContainer.appendChild(generateDaysOfWeekHeader());

            const calendarGrid = document.createElement('div');
            calendarGrid.classList.add('calendar-grid');
            monthContainer.appendChild(calendarGrid);

            const firstDayOfMonth = new Date(year, month, 1).getDay();
            for (let i = 0; i < firstDayOfMonth; i++) {
                const emptyCell = document.createElement('div');
                emptyCell.classList.add('calendar-day', 'empty');
                calendarGrid.appendChild(emptyCell);
            }

            const daysInMonth = new Date(year, month + 1, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                const dayCell = document.createElement('div');
                dayCell.classList.add('calendar-day');
                dayCell.textContent = day;

                const date = new Date(year, month, day);
                const formattedDate = getFormattedDate(date);

                const eventsForDay = events.filter(event => event.date === formattedDate);
                if (eventsForDay.length > 0) {
                    dayCell.classList.add('has-event');
                }

                dayCell.addEventListener('click', () => {
                    showEventForm(year, month, day);
                    generateDailyCalendar(date);
                });
                calendarGrid.appendChild(dayCell);
            }
        }
    }

    function generateMonthlyCalendar(year, month) {
        console.log(`Generando calendario mensual para: ${getMonthName(month)} ${year}`);
        const calendarContainer = document.createElement('div');
        calendarContainer.id = 'calendar-container';
        calendarContainer.classList.add('calendar-monthly');
        calendarSection.appendChild(calendarContainer);
    
        const calendarHeader = document.createElement('div');
        calendarHeader.id = 'calendar-header';
        calendarHeader.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center;">
                <button id="prev-month">Anterior</button>
                <h3 style="margin: 0 15px;">${getMonthName(month)} ${year}</h3>
                <button id="next-month">Siguiente</button>
            </div>
            <div style="display: flex; justify-content: center; align-items: center; margin-top: 10px;">
                <label for="month-select">Mes:</label>
                <select id="month-select">
                    ${Array.from({ length: 12 }, (_, i) => `<option value="${i}" ${i === month ? 'selected' : ''}>${getMonthName(i)}</option>`).join('')}
                </select>
                <label for="year-input" style="margin-left: 10px;">Año:</label>
                <input type="number" id="year-input" value="${year}" style="width: 80px; margin-left: 5px;">
                <button id="go-to-date" style="margin-left: 10px;">Ir</button>
            </div>
        `;
        calendarContainer.appendChild(calendarHeader);
    
        const daysOfWeekHeader = generateDaysOfWeekHeader();
        calendarContainer.appendChild(daysOfWeekHeader);
    
        const calendarGrid = document.createElement('div');
        calendarGrid.classList.add('calendar-grid');
        calendarContainer.appendChild(calendarGrid);
    
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('calendar-day', 'empty');
            calendarGrid.appendChild(emptyCell);
        }
    
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('calendar-day');
            dayCell.innerHTML = `
                <div class="day-number" style="margin-bottom: 10px;">${day}</div>
                <div class="events-list"></div>
            `;
            
            const date = new Date(year, month, day);
            const formattedDate = getFormattedDate(date);
    
            const eventsForDay = events.filter(event => event.date === formattedDate);
            if (eventsForDay.length > 0) {
                dayCell.classList.add('has-event');
                const eventsList = dayCell.querySelector('.events-list');
                eventsForDay.forEach(event => {
                    const eventItem = document.createElement('div');
                    eventItem.classList.add('event-item');
                    eventItem.innerHTML = `<span class="event-time">${event.time}</span> - <span class="event-description">${event.description}</span>`;
                    eventsList.appendChild(eventItem);
                });
            }
    
            dayCell.addEventListener('click', () => {
                showEventForm(year, month, day);
                generateDailyCalendar(new Date(year, month, day));
            });
            calendarGrid.appendChild(dayCell);
        }
    
        updateCalendarEvents(year, month);
    
        document.getElementById('prev-month').addEventListener('click', () => {
            const newDate = new Date(year, month - 1);
            generateCalendar('monthly', newDate);
        });
    
        document.getElementById('next-month').addEventListener('click', () => {
            const newDate = new Date(year, month + 1);
            generateCalendar('monthly', newDate);
        });
    
        document.getElementById('go-to-date').addEventListener('click', () => {
            const selectedMonth = parseInt(document.getElementById('month-select').value);
            const selectedYear = parseInt(document.getElementById('year-input').value);
            generateCalendar('monthly', new Date(selectedYear, selectedMonth));
        });
    }
    
 
    function generateDailyCalendar(date) {
        console.log(`Generando calendario diario para: ${getFormattedDate(date)}`);
        calendarSection.innerHTML = '';
    
        const calendarContainer = document.createElement('div');
        calendarContainer.id = 'calendar-container';
        calendarSection.appendChild(calendarContainer);
    
        const calendarHeader = document.createElement('div');
        calendarHeader.id = 'calendar-header';
        calendarHeader.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center;">
                <button id="prev-day">Anterior</button>
                <h3 style="margin: 0 15px;">${getFormattedDate(date)}</h3>
                <button id="next-day">Siguiente</button>
            </div>
            <div style="display: flex; justify-content: center; align-items: center; margin-top: 10px;">
                <label for="day-input">Fecha:</label>
                <input type="date" id="day-input" value="${getFormattedDate(date)}">
                <button id="go-to-day" style="margin-left: 10px;">Ir</button>
            </div>
        `;
        calendarContainer.appendChild(calendarHeader);
    
        const dailySchedule = document.createElement('div');
        dailySchedule.id = 'daily-schedule';
        calendarContainer.appendChild(dailySchedule);
    
        const timeSlots = ['06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM'];
        timeSlots.forEach(time => {
            const timeSlot = document.createElement('div');
            timeSlot.classList.add('time-slot');
            timeSlot.textContent = time;
            dailySchedule.appendChild(timeSlot);
    
            const eventsForTime = events.filter(event => event.date === getFormattedDate(date) && event.time === time);
            eventsForTime.forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.textContent = `${event.description} (${event.participants.join(', ')})`;
                eventDiv.addEventListener('click', () => showEventForm(date.getFullYear(), date.getMonth(), date.getDate(), time));
                timeSlot.appendChild(eventDiv);
            });
        });
    
        document.getElementById('prev-day').addEventListener('click', () => {
            const newDate = new Date(date);
            newDate.setDate(date.getDate() - 1);
            generateDailyCalendar(newDate);
        });
    
        document.getElementById('next-day').addEventListener('click', () => {
            const newDate = new Date(date);
            newDate.setDate(date.getDate() + 1);
            generateDailyCalendar(newDate);
        });
    
        document.getElementById('go-to-day').addEventListener('click', () => {
            const selectedDate = new Date(document.getElementById('day-input').value);
            generateDailyCalendar(selectedDate);
        });
    }
    
    
    function updateEvent(existingEvent, updatedData) {
        existingEvent.time = updatedData.time;
        existingEvent.description = updatedData.description;
        existingEvent.participants = updatedData.participants;
        alert('Evento actualizado correctamente');
        
        // Convertir la fecha actualizada en un objeto Date
        const updatedDate = new Date(updatedData.date);
    
        // Regenerar el calendario diario con la fecha actualizada
        generateDailyCalendar(updatedDate);
    
        eventFormSection.style.display = 'none'; // Ocultar el formulario después de actualizar el evento
    }
    
    

    function showEventForm(year, month, day, time = null) {
        console.log(`Mostrando formulario de evento para: ${year}-${month + 1}-${day} ${time ? 'a las ' + time : ''}`);
        eventFormSection.innerHTML = '';

        const eventForm = document.createElement('form');
        eventForm.id = 'event-form';

        const dateField = document.createElement('input');
        dateField.type = 'date';
        dateField.value = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const timeField = document.createElement('select');
        const timeOptions = ['06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM'];
        timeOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            timeField.appendChild(optionElement);
        });
        if (time) {
            timeField.value = time;
        }

        const descriptionField = document.createElement('input');
        descriptionField.type = 'text';
        descriptionField.placeholder = 'Descripción del evento';

        const participantsField = document.createElement('input');
        participantsField.type = 'text';
        participantsField.placeholder = 'Nombres de los participantes';

        eventForm.appendChild(dateField);
        eventForm.appendChild(timeField);
        eventForm.appendChild(descriptionField);
        eventForm.appendChild(participantsField);

        const existingEvent = events.find(event => event.date === dateField.value && event.time === (time || timeField.value));
        if (existingEvent) {
            timeField.value = existingEvent.time;
            descriptionField.value = existingEvent.description;
            participantsField.value = existingEvent.participants.join(', ');

            const updateButton = document.createElement('button');
            updateButton.type = 'button';
            updateButton.textContent = 'Actualizar Evento';
            updateButton.classList.add('update-button');
            updateButton.addEventListener('click', () => {
                updateEvent(existingEvent, {
                    date: dateField.value,
                    time: timeField.value,
                    description: descriptionField.value,
                    participants: participantsField.value.split(',').map(name => name.trim())
                });
            });

            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.textContent = 'Eliminar Evento';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', () => {
                deleteEvent(existingEvent);
            });

            eventForm.appendChild(updateButton);
            eventForm.appendChild(deleteButton);
        } else {
            const submitButton = document.createElement('button');
            submitButton.type = 'submit';
            submitButton.textContent = 'Guardar Evento';
            eventForm.appendChild(submitButton);

            eventForm.addEventListener('submit', (event) => {
                event.preventDefault();
                manageEvent({
                    date: dateField.value,
                    time: timeField.value,
                    description: descriptionField.value,
                    participants: participantsField.value.split(',').map(name => name.trim())
                });
                eventForm.reset();
                generateCalendar('daily', new Date(year, month, day));
                eventFormSection.style.display = 'none';
            });
        }

        eventFormSection.appendChild(eventForm);
        eventFormSection.style.display = 'block';
        eventFormSection.scrollIntoView({ behavior: 'smooth' });
    }

    function updateEvent(existingEvent, updatedData) {
        existingEvent.time = updatedData.time;
        existingEvent.description = updatedData.description;
        existingEvent.participants = updatedData.participants;
        alert('Evento actualizado correctamente');
        generateDailyCalendar(new Date(updatedData.date));
        eventFormSection.style.display = 'none';
    }

    function deleteEvent(eventToDelete) {
        events = events.filter(event => event !== eventToDelete);
        alert('Evento eliminado correctamente');
        generateDailyCalendar(new Date(eventToDelete.date));
        eventFormSection.style.display = 'none';
    }

    function getFormattedDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function getMonthName(monthIndex) {
        const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return monthNames[monthIndex];
    }

    function manageEvent(eventData) {
        const { date, time, description, participants } = eventData;

        const existingEvent = events.find(event => event.date === date && event.time === time);

        if (existingEvent) {
            existingEvent.description = description;
            existingEvent.participants = participants;
            alert('Evento actualizado correctamente');
        } else {
            const newEvent = { date, time, description, participants };
            events.push(newEvent);
            alert('Evento creado correctamente');
        }

        updateCalendarEvents(new Date(date).getFullYear(), new Date(date).getMonth());
    }

    function updateCalendarEvents(year, month) {
        const calendarDays = document.querySelectorAll('.calendar-day:not(.empty)');
        calendarDays.forEach(dayCell => {
            const day = parseInt(dayCell.textContent);
            const date = new Date(year, month, day);
            const formattedDate = getFormattedDate(date);

            const eventsForDay = events.filter(event => event.date === formattedDate);
            if (eventsForDay.length > 0) {
                dayCell.classList.add('has-event');
                dayCell.addEventListener('click', () => {
                    showEventForm(year, month, day);
                    generateDailyCalendar(date);
                });
            } else {
                dayCell.classList.remove('has-event');
            }
        });
    }

    viewAnnualButton.addEventListener('click', () => generateCalendar('annual'));
    viewMonthlyButton.addEventListener('click', () => generateCalendar('monthly'));
    viewDailyButton.addEventListener('click', () => {
        const specificDate = new Date();
        generateCalendar('daily', specificDate);
    });

    generateCalendar('monthly');
});

