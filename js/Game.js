class Game
{
    constructor() {
        // Тут ключевые точки
        this.path = [
            {x: 445, y: 505},
            {x: 350, y: 475},
            {x: 276, y: 517},
            {x: 189, y: 536},
            {x: 110, y: 507}
        ];
        // Координаты траектории движения между ключевыми точками
        this.miniStepX = [
            [430, 423, 415, 408, 402, 391, 378, 367, 358],
            [340, 333, 324, 315, 304, 294, 286],
            [265, 259, 253, 247, 241, 234, 227, 219, 211, 204, 200],
            [177, 171, 165, 158, 152, 146, 140, 134, 128, 123]
        ];
        this.miniStepY = [
            [497, 492, 488, 480, 470, 464, 462, 465, 468],
            [480, 484, 490, 496, 500, 505, 509],
            [523, 526, 529, 531, 532, 533, 534, 535, 536, 536, 536],
            [535, 534, 533, 532, 530, 527, 524, 521, 518, 515]
        ];
        // Текущая ключевая точка на карте
        this.curStep = 0;

        this.init();
    }

    init() {
        // Занять стартовую точку
        this.startPosition();

        // Вешаем события прокрутки слайдера друзей
        const menu = document.querySelector('.friends .viewport');
        const left = document.querySelector('.arrow-left');
        const right = document.querySelector('.arrow-right');
        const step = 60;

        menu.scrollLeft = (step * 3) - 5;

        left.addEventListener('click', () => menu.scrollLeft -= step);
        right.addEventListener('click', () => menu.scrollLeft += step);
    };

    // Совершить ход
    step() {
        if (this.curStep >= this.path.length - 1) {
            this.curStep = 0;
            this.startPosition();

            return setTimeout(() => {
                alert("Дальше не делал для экономии времени\nПяти шагов достаточно для демонстрации :)");
                console.log('И неплохо бы автоматизировать получение координат траектории двиджения -__-');
            }, 300);
        }

        const from = {
            x: this.path[this.curStep].x,
            y: this.path[this.curStep].y
        };
        const to = {
            x: this.path[this.curStep + 1].x,
            y: this.path[this.curStep + 1].y
        };
        const route = {
            x: this.miniStepX[this.curStep],
            y: this.miniStepY[this.curStep]
        };

        girl.step(from, to, route, this.miniStepX[this.curStep].length)
            .then(() => {
                this.curStep++;
            });
    };

    // Занять стартовую позицию
    startPosition() {
        girl.move(this.path[this.curStep].x, this.path[this.curStep].y);
    };

    // Событие открытия рейтинга
    leaderboard() {
        const shadow = document.createElement('div');
        const popup = document.querySelector('.leaderboardPopup');
        const weekTab = document.querySelector('#week');
        const generalTab = document.querySelector('#general');
        const weekContent = document.querySelector('#weekBoard');
        const generalContent = document.querySelector('#generalBoard');
        const game = document.querySelector('.game');
        const closeIcon = document.querySelector('.close');

        // Создаем слой с тенью
        shadow.classList.add('shadow');
        game.appendChild(shadow);

        // Показываем окно рейтинг
        popup.classList.add('show');

        // Обработчик закрытия окна рейтинг
        closeIcon.addEventListener('click', () => this.leaderBoardClose(shadow, popup));

        // Заполняем рейтинг
        this.onTabActivated(weekContent);

        const toggleAll = e => {
            const relatedContent = e.target.id === 'week' ? weekContent : generalContent;

            if (relatedContent.classList.contains('active')) return false;

            document.querySelectorAll('.board')
                .forEach(board => board.classList.toggle('active'));
        };

        // Отслеживаем клики по вкладкам
        weekTab.addEventListener('click', e => {
            toggleAll(e);
            this.onTabActivated(weekContent);
        });

        generalTab.addEventListener('click', e => {
            toggleAll(e);
            this.onTabActivated(generalContent);
        });
    };

    // Метод для закрытия окна рейтинг
    leaderBoardClose(shadow, popup) {
        shadow.remove();
        popup.classList.remove('show');
    };

    // Создать элемент рейтинга
    leaderBoardSet(content, rank, user, friends) {
        const el = document.createElement('div');

        el.classList.add('boardItem');

        if (friends.indexOf(parseInt(user.id)) !== -1) {
            el.classList.add('friend');
        }

        el.innerHTML = `<span>${rank}</span><span>${user.name} ${user.lastName}</span><span>${user.points}</span>`;

        content.appendChild(el);
    };

    // Событие открытия вкладки - заполняем рейтинг данными (единожды для каждой вкладки)
    onTabActivated(tabContent) {
        if (tabContent.querySelector('.boardItem')) return false;

        const friendIds = data.friends.map(friend => parseInt(friend.id));

        data.rating
            .filter(user => {
                user.points = parseInt(user.points);
                return user;
            })
            .sort((a, b) => {
                if (a.points > b.points) {
                    return -1;
                }
                if (a.points < b.points) {
                    return 1;
                }
                return 0;
            })
            .splice(0, tabContent.id.indexOf('week') !== -1 ? 3 : 7)
            .forEach((user, index) => {
                this.leaderBoardSet(tabContent, ++index, user, friendIds)
            });
    };
}