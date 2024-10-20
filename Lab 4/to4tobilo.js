// Функция для стилизованных заголовков
function printTitle(title) {
    const border = '========================';
    console.log(`\n${border}`);
    console.log(`     ${title}`);
    console.log(`${border}\n`);
}

// Функция для разделителей
function printDivider() {
    console.log('----------------------------------------');
}

// Функция для красивого отображения текста действия
function printAction(action) {
    console.log(`* ${action}`);
}

// Предыстория Могучих Рейнджеров
printTitle("Могучие Рейнджеры: Защита Земли");
console.log("Давным-давно, во вселенной царило зло. Враги, захватившие множество миров, добрались до Земли. Но шестеро избранных стали Могучими Рейнджерами, чтобы защитить планету.");

// Класс Рейнджера
class Ranger {
    constructor(name, color, weapon, specialMove) {
        this.name = name;
        this.color = color;
        this.weapon = weapon;
        this.specialMove = specialMove;
        this.health = 100;
        this.nextAttackWeakness = 0; // Эффект слабости
        this.bleeding = null; // Эффект кровотечения
        this.alive = true;
    }

    shout() {
        printAction(`${this.color} Рейнджер готов к бою!`);
    }

    attack(enemy) {
        const damage = Math.floor(Math.random() * 30) + 10;
        printAction(`${this.color} Рейнджер использует ${this.weapon}, нанося ${damage} урона!`);
        enemy.takeDamage(damage);
    }

    specialAttack(enemy) {
        const damage = Math.floor(Math.random() * 50) + 30;
        printAction(`${this.color} Рейнджер использует особую атаку: ${this.specialMove}, нанося ${damage} урона!`);
        enemy.takeDamage(damage);
    }

    takeDamage(amount) {
        if (this.nextAttackWeakness > 0) {
            amount -= this.nextAttackWeakness;
            printAction(`${this.name} ослаблен! Урон уменьшен на ${this.nextAttackWeakness}.`);
            this.nextAttackWeakness = 0;
        }

        this.health -= amount;
        this.health = Math.max(this.health, 0);
        printAction(`${this.name} получает ${amount} урона! Осталось ${this.health} здоровья.`);
        if (this.health <= 0) {
            this.alive = false;
            console.log(`💀 ${this.name} был побежден!`);
        }
    }

    applyBleedingEffect() {
        if (this.bleeding) {
            const bleedDamage = this.bleeding.damage;
            this.health -= bleedDamage;
            this.health = Math.max(this.health, 0);
            printAction(`${this.name} теряет ${bleedDamage} здоровья от кровотечения! Осталось ${this.health} здоровья.`);
            this.bleeding.turns--;
            if (this.bleeding.turns <= 0) {
                console.log(`${this.name} больше не испытывает эффект кровотечения.`);
                this.bleeding = null;
            }
        }
    }

    isAlive() {
        return this.alive;
    }
}

// Класс злодея
class Villain {
    constructor(name, phase) {
        this.name = name;
        this.health = phase === 1 ? 500 : 1000; // Увеличение здоровья во второй фазе
        this.phase = phase;
        this.attackPhrases = phase === 1 ? [
            { name: "Атака Тьмы", damage: Math.floor(Math.random() * 40) + 10 },
            { name: "Теневой удар", damage: Math.floor(Math.random() * 60) + 30 },
            { name: "Удар силы", damage: 70 }
        ] : [
            { name: "Критический разлом", damage: 150 },
            { name: "Когти тьмы", damage: Math.floor(Math.random() * 100) + 50 },
            { name: "Энергетический шторм", damage: Math.floor(Math.random() * 60) + 30, effect: "bleed" }
        ]; // Разные атаки для фаз
    }

    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
        }
    }

    isDefeated() {
        return this.health <= 0;
    }

    getRandomAttack() {
        return this.attackPhrases[Math.floor(Math.random() * this.attackPhrases.length)];
    }

    attackTarget(targets) {
        const attack = this.getRandomAttack();
        let damage = attack.damage;
        console.log(`\n${this.name} использует "${attack.name}" и наносит ${damage} урона!`);

        if (attack.effect === "bleed") {
            console.log("Цель поражена кровотечением, будет терять здоровье несколько ходов!");
            targets.forEach(target => target.bleeding = { damage: Math.floor(Math.random() * 5) + 2, turns: Math.floor(Math.random() * 3) + 2 }); // Кровотечение на 2-5 ходов
        }

        targets.forEach(target => target.takeDamage(damage));
    }

    displayHealth() {
        const healthBar = '█'.repeat(this.health / 50) + '-'.repeat(20 - this.health / 50);
        console.log(`${this.name} [${healthBar}] ${this.health}/1000`);
    }
}

// Класс Мегазорда
class Megazord {
    constructor(rangers) {
        this.rangers = rangers;
        this.health = this.calculateHealth();
        this.alive = true;
    }

    calculateHealth() {
        return this.rangers.reduce((total, ranger) => total + ranger.health, 0);
    }

    unite() {
        printTitle("Объединение рейнджеров!");
        this.health = this.calculateHealth();
        printAction(`Общее здоровье Мегазорда: ${this.health}`);
    }

    takeDamage(damage) {
        this.health -= damage;
        this.health = Math.max(this.health, 0);
        printAction(`Мегазорд получает ${damage} урона! Осталось ${this.health} здоровья.`);
        if (this.health <= 0) {
            this.alive = false;
            console.log("💥 Мегазорд был побежден! Рейнджеры проиграли битву!");
        }
    }

    attack(enemy) {
        const damage = Math.floor(Math.random() * 100) + 50;
        printAction(`Мегазорд наносит мощный удар, нанося ${damage} урона!`);
        enemy.takeDamage(damage);
    }

    isAlive() {
        return this.alive;
    }
}

// Инициализация рейнджеров
const rangers = [
    new Ranger('Джейсон', 'Красный', 'Меч силы', 'Огненный удар'),
    new Ranger('Зак', 'Черный', 'Коса тьмы', 'Теневой удар'),
    new Ranger('Томми', 'Зеленый', 'Драконий клинок', 'Изумрудный вихрь'),
    new Ranger('Билли', 'Синий', 'Электро-щит', 'Молниеносный заряд'),
    new Ranger('Трини', 'Желтый', 'Кинжалы тигра', 'Золотой вихрь'),
    new Ranger('Кимберли', 'Розовый', 'Лук феникса', 'Пламенная стрела')
];

// Инициализация первой фазы "Властелина тьмы"
let villain = new Villain('Властелин тьмы', 1);

// Функция для боя
function battle() {
    let megazord = null;
    while (true) {
        // Показать здоровье всех рейнджеров
        console.log("\nЗдоровье Рейнджеров:");
        rangers.forEach(ranger => ranger.applyBleedingEffect());
        rangers.forEach(ranger => ranger.isAlive() && ranger.takeDamage(0)); // Обновить здоровье рейнджеров без урона

        // Показать здоровье злодея
        villain.displayHealth();

        // Враг атакует случайное количество рейнджеров (до объединения)
        if (!megazord) {
            let targets = rangers.filter(ranger => ranger.isAlive()).slice(0, Math.floor(Math.random() * 4) + 2); // От 2 до 5 рейнджеров
            villain.attackTarget(targets);
        }

        // Проверка, живы ли рейнджеры, чтобы объединиться
        if (rangers.every(ranger => !ranger.isAlive())) {
            console.log('\nРейнджеры потерпели поражение!');
            break;
        }

        // Рейнджеры объединяются в Мегазорда, если остались в живых
        if (!megazord && rangers.some(ranger => ranger.isAlive())) {
            console.log('\nРейнджеры объединяются в Мегазорда!');
            megazord = new Megazord(rangers.filter(ranger => ranger.isAlive()));
            megazord.unite();
        }

        // Если Мегазорд существует, он атакует
        if (megazord) {
            megazord.attack(villain);
        }

        // Проверка здоровья злодея
        if (villain.isDefeated()) {
            console.log('\nВластелин тьмы был повержен! Рейнджеры победили первую фазу.');
            break;
        }

        // Если злодей выживает, он меняет фазу
        if (villain.health <= 250 && villain.phase === 1) {
            villain = new Villain('Властелин тьмы', 2); // Переход на вторую фазу
            console.log('\nВластелин тьмы меняет свою форму и становится сильнее!');
        }
    }
}

// Запуск боя
battle();
