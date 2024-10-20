class Ranger {
    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.health = 100;
        this.alive = true;
        this.attacks = [
            { name: "Удар меча", damage: Math.floor(Math.random() * 40) + 10 },
            { name: "Энергетический выстрел", damage: Math.floor(Math.random() * 70) + 30 },
            { name: "Критический удар", damage: Math.floor(Math.random() * 100) + 50 },
            { name: "Суператака", damage: 200 }
        ];
    }

    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.alive = false;
        }
    }

    isAlive() {
        return this.alive;
    }

    attack() {
        const randomAttack = this.attacks[Math.floor(Math.random() * this.attacks.length)];
        console.log(`\n${this.name} использует ${randomAttack.name} и наносит ${randomAttack.damage} урона!`);
        return randomAttack.damage;
    }

    displayHealth() {
        const healthBar = '█'.repeat(this.health / 10) + '-'.repeat(10 - this.health / 10);
        console.log(`${this.name} [${healthBar}] ${this.health}/100`);
    }
}

class Villain {
    constructor(name, phase) {
        this.name = name;
        this.health = phase === 1 ? 500 : 1000; // Увеличение здоровья во второй фазе
        this.phase = phase;
        this.effects = { bleed: 0, weaken: 0 };
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
            console.log("Мегазорд поражен кровотечением, будет терять здоровье несколько ходов!");
            targets.forEach(target => target.effects.bleed = Math.floor(Math.random() * 5) + 2); // Кровотечение на 2-5 ходов
        }

        targets.forEach(target => target.takeDamage(damage));
    }

    displayHealth() {
        const healthBar = '█'.repeat(this.health / 50) + '-'.repeat(20 - this.health / 50);
        console.log(`${this.name} [${healthBar}] ${this.health}/1000`);
    }
}

class Megazord {
    constructor(rangers) {
        this.rangers = rangers;
        this.health = this.calculateHealth();
        this.alive = true;
        this.effects = { bleed: 0, weaken: 0 }; // Эффекты для Мегазорда
    }

    calculateHealth() {
        return this.rangers.reduce((total, ranger) => total + ranger.health, 0);
    }

    takeDamage(damage) {
        if (this.effects.weaken > 0) {
            console.log("Мегазорд ослаблен, урон увеличен!");
            damage += Math.floor(Math.random() * 40) + 30; // Увеличение урона на 30-70
            this.effects.weaken--;
        }

        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.alive = false;
        }
    }

    bleedEffect() {
        if (this.effects.bleed > 0) {
            const bleedDamage = Math.floor(Math.random() * 10) + 7; // Потеря от 7 до 10 здоровья
            console.log(`\nМегазорд теряет ${bleedDamage} здоровья из-за кровотечения!`);
            this.health -= bleedDamage;
            this.effects.bleed--;
        }
    }

    isAlive() {
        return this.alive;
    }

    attack() {
        const damage = Math.floor(Math.random() * 100) + 50;
        console.log(`\nМегазорд наносит мощный удар на ${damage} урона!`);
        return damage;
    }

    displayHealth() {
        const healthBar = '█'.repeat(this.health / 100) + '-'.repeat(70 - this.health / 100);
        console.log(`Мегазорд [${healthBar}] ${this.health}/700`);
    }
}

// Предыстория
console.log("Давным-давно, во вселенной царило зло. Враги, захватившие множество миров, добрались до Земли.");
console.log("Но шестеро избранных стали Могучими Рейнджерами, чтобы защитить планету от тьмы.\n");

// Инициализация рейнджеров
const rangers = [
    new Ranger('Джейсон', 'Красный'),
    new Ranger('Зак', 'Черный'),
    new Ranger('Томми', 'Зеленый'),
    new Ranger('Билли', 'Синий'),
    new Ranger('Трини', 'Желтый'),
    new Ranger('Кимберли', 'Розовый')
];

// Инициализация первой фазы "Властелина тьмы"
let villain = new Villain('Властелин тьмы', 1);

// Функция для боя
function battle() {
    while (true) {
        // Показать здоровье всех рейнджеров
        console.log("\nЗдоровье Рейнджеров:");

        // Показать здоровье злодея
        villain.displayHealth();

        // Враг атакует случайное количество рейнджеров (до объединения)
        if (!megazord) {
            let numRangers = Math.floor(Math.random() * 4) + 2; // От 2 до 5 рейнджеров
            let targets = [];
            for (let i = 0; i < numRangers; i++) {
                let target = rangers[Math.floor(Math.random() * rangers.length)];
                if (target.isAlive()) {
                    targets.push(target);
                }
            }
            villain.attackTarget(targets);
        }

        // Проверка, живы ли рейнджеры, чтобы объединиться
        if (rangers.every(ranger => ranger.isAlive() === false)) {
            console.log('\nРейнджеры потерпели поражение!');
            break;
        }

        // Рейнджеры объединяются в Мегазорда, если остались в живых
        if (!megazord && rangers.some(ranger => ranger.isAlive())) {
            console.log('\nРейнджеры объединяются в Мегазорда!');
            megazord = new Megazord(rangers);
        }

        // Мегазорд атакует
        if (megazord) {
            megazord.bleedEffect(); // Эффект кровотечения
            megazord.displayHealth(); // Показываем здоровье мегазорда
            let megazordAttack = megazord.attack();
            villain.takeDamage(megazordAttack);
        }

        // Враг атакует Мегазорда после объединения
        if (megazord && megazord.isAlive()) {
            villain.attackTarget([megazord]);
        }

        // Если враг побежден в первой фазе
        if (villain.isDefeated() && villain.phase === 1) {
            console.log('\nВластелин тьмы: "А вот сейчас я стану серьезным!"');
            villain = new Villain('Властелин тьмы', 2); // Переход ко второй фазе
        }

        // Если враг побежден во второй фазе
        if (villain.isDefeated() && villain.phase === 2) {
            console.log('\nВластелин тьмы побежден!');
            break;
        }

        // Проверка, жив ли Мегазорд
        if (!megazord.isAlive()) {
            console.log('\nМегазорд был уничтожен. Рейнджеры проиграли!');
            break;
        }
    }
}

let megazord = null;
battle();
