class Girl
{
    constructor() {
        this.el = document.querySelector('.girl');
        this.height = this.el.offsetHeight;
        this.centerX = this.el.offsetWidth / 2;
    }

    /**
     * Передвинуть иконку ГГ
     *
     * @param {Number} x
     * @param {Number} y
     */
    move(x, y) {
        x = x - this.centerX;
        y = y - this.height;

        this.el.style.cssText = `left: ${x}px; top: ${y}px;`;
    };

    /**
     * Сделать шаг на карте. Выполняет анимацию передвижения.
     * Возвращает промис
     *
     * @param {Object} from - ключевая точка отправления
     * @param {Object} to - ключевая точка назначения
     * @param {Object} route - объект с полями x: array и y:array, траектория движения
     * @param {Number} routeStepCount - длина траектории движения
     * @returns {Promise<any>}
     */
    step(from, to, route, routeStepCount) {
        let stepsIterator = 0;

        return new Promise(resolve => {
            const recursive = () => {
                this.move(route.x[stepsIterator], route.y[stepsIterator]);

                stepsIterator++;

                if (stepsIterator >= routeStepCount) {
                    this.move(to.x, to.y);
                    return resolve();
                }

                setTimeout(recursive, 110);
            };

            recursive();
        });
    }
}