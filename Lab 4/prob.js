// Предыстория Могучих Рейнджеров
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
    }

    shout() {
        console.log(`${this.color} Рейнджер готов к бою!`);
    }

    attack(enemy) {
        const damage = Math.floor(Math.random() * 30) + 10;
        console.log(`${this.color} Рейнджер использует ${this.weapon}, нанося ${damage} урона!`);
        enemy.takeDamage(damage);
    }

    specialAttack(enemy) {
        const damage = Math.floor(Math.random() * 50) + 30;
        console.log(`${this.color} Рейнджер использует особую атаку: ${this.specialMove}, нанося ${damage} урона!`);
        enemy.takeDamage(damage);
    }

    takeDamage(amount) {
        if (this.nextAttackWeakness > 0) {
            amount -= this.nextAttackWeakness;
            console.log(`${this.name} ослаблен! Урон уменьшен на ${this.nextAttackWeakness}.`);
            this.nextAttackWeakness = 0;
        }

        this.health -= amount;
        this.health = Math.max(this.health, 0);
        console.log(`${this.name} получает ${amount} урона! Осталось ${this.health} здоровья.`);
        if (this.health <= 0) {
            console.log(`${this.name} был побежден!`);
        }
    }

    applyBleedingEffect() {
        if (this.bleeding) {
            const bleedDamage = this.bleeding.damage;
            this.health -= bleedDamage;
            this.health = Math.max(this.health, 0);
            this.bleeding.turns--;
            console.log(`${this.name} теряет ${bleedDamage} здоровья от кровотечения! Осталось ${this.health} здоровья.`);
            if (this.bleeding.turns <= 0) {
                console.log(`${this.name} больше не испытывает эффект кровотечения.`);
                this.bleeding = null;
            }
        }
    }
}

// Класс Мегазорда
class Megazord {
    constructor(rangers) {
        this.rangers = rangers;
        this.health = this.calculateHealth();
    }

    calculateHealth() {
        return this.rangers.reduce((total, ranger) => total + ranger.health, 0);
    }

    unite() {
        console.log("Рейнджеры объединяются в Мегазорда!");
        this.health = this.calculateHealth();
        console.log(`Общее здоровье Мегазорда: ${this.health}`);
    }

    attack(enemy) {
        const damage = Math.floor(Math.random() * 100) + 50;
        console.log(`Мегазорд наносит мощный удар, нанося ${damage} урона!`);
        enemy.takeDamage(damage);
    }

    takeDamage(amount) {
        this.health -= amount;
        this.health = Math.max(this.health, 0);
        console.log(`Мегазорд получает ${amount} урона! Осталось ${this.health} здоровья.`);
        if (this.health <= 0) {
            console.log("Мегазорд был побежден! Рейнджеры проиграли битву!");
        }
    }
}

// Класс врага с двумя фазами
class Enemy {
    constructor(name) {
        this.name = name;
        this.health = 200; // Фаза 1: здоровье
        this.phase = 1;
        this.strength = 40;
        this.weaknessApplied = false;
    }

    takeDamage(amount) {
        this.health -= amount;
        this.health = Math.max(this.health, 0);
        console.log(`${this.name} получает ${amount} урона! Осталось ${this.health} здоровья.`);

        if (this.health <= 0 && this.phase === 1) {
            this.phase = 2;
            this.health = 300; // Фаза 2: больше здоровья
            this.strength += 20; // Фаза 2: больше силы
            console.log(`${this.name}: "А вот сейчас я стану серьезным!"`);
        } else if (this.health <= 0 && this.phase === 2) {
            console.log(`${this.name} был побежден!`);
        }
    }

    attack(target) {
        const damage = Math.floor(Math.random() * this.strength) + 10;
        console.log(`${this.name} атакует ${target.name}, нанося ${damage} урона!`);
        target.takeDamage(damage);
    }

    applyWeakness(target) {
        if (!this.weaknessApplied) {
            const damage = Math.floor(Math.random() * 60) + 30;
            console.log(`${this.name} использует "Проклятие слабости", нанося ${damage} урона и ослабляя ${target.name}.`);
            target.takeDamage(damage);
            target.nextAttackWeakness = Math.floor(Math.random() * 70) + 30;
            this.weaknessApplied = true;
        }
    }

    bleedingEffect(target) {
        const turns = Math.floor(Math.random() * 4) + 2;
        console.log(`${this.name} накладывает "Эффект кровотечения" на ${target.name}, нанося урон на ${turns} ходов.`);
        target.bleeding = { turns: turns, damage: Math.floor(Math.random() * 4) + 7 };
    }

    multiAttack(rangers) {
        const numTargets = Math.floor(Math.random() * 6) + 1;
        console.log(`${this.name} атакует ${numTargets} рейнджеров одновременно!`);
        const selectedRangers = [];
        while (selectedRangers.length < numTargets) {
            const randomRanger = randomChoice(rangers);
            if (!selectedRangers.includes(randomRanger)) {
                selectedRangers.push(randomRanger);
            }
        }
        selectedRangers.forEach(ranger => this.attack(ranger));
    }
}

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Рейнджеры
const redRanger = new Ranger("Джейсон", "Красный", "Меч силы", "Огненный удар");
const blackRanger = new Ranger("Зак", "Черный", "Коса тьмы", "Теневой удар");
const greenRanger = new Ranger("Томми", "Зеленый", "Драконий клинок", "Изумрудный вихрь");
const blueRanger = new Ranger("Билли", "Синий", "Электро-щит", "Молниеносный заряд");
const yellowRanger = new Ranger("Трини", "Желтый", "Кинжалы тигра", "Золотой вихрь");
const pinkRanger = new Ranger("Кимберли", "Розовый", "Лук феникса", "Пламенная стрела");
const purpleRanger = new Ranger("Майя", "Фиолетовый", "Магический посох", "Темная энергия");

const rangers = [redRanger, blackRanger, greenRanger, blueRanger, yellowRanger, pinkRanger, purpleRanger];

// Злодей
const enemy = new Enemy("Властелин тьмы");

// Мегазорд
const megazord = new Megazord(rangers);

// Логический флаг для завершения битвы
let battleEnded = false;

console.log("\nГЛАВА 1: Наступление зла");
rangers.forEach(ranger => ranger.shout());

// В начале злодей атакует рейнджеров (случайное количество)
enemy.multiAttack(rangers);

// Рейнджеры атакуют
rangers.forEach(ranger => {
    if (ranger.health > 0) {
        ranger.attack(enemy);
        ranger.applyBleedingEffect();
    }
});

// Рейнджеры объединяются в Мегазорда
megazord.unite();

// Пошаговая битва
function battleRound() {
    console.log("\nНовый раунд битвы начинается!");

    // Проверка исхода битвы перед началом
    if (battleEnded) return;

    // Мегазорд атакует
    megazord.attack(enemy);

    // Враг атакует только Мегазорда в фазе 2
    if (enemy.phase === 2 && enemy.health > 0) {
        enemy.attack(megazord);
    }

    // Проверка на исход боя
    if (megazord.health <= 0 || enemy.health <= 0) {
        battleEnded = true;
        console.log("Битва завершена!");
    }
}

// Вызов битвы
battleRound();
