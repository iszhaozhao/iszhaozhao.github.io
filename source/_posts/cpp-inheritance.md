---
title: "C++学习笔记 - 继承和派生"
date: 2023-05-15 12:00:00
updated: 2026-03-17 12:00:00
categories:
  - "C++"
tags:
  - "C++"
  - "面向对象"
  - "继承"
  - "派生"
---
## 前言

继承是面向对象编程的三大特性之一（封装、继承、多态）。它允许我们基于已有的类创建新类，新类自动拥有基类的成员，同时可以添加新的成员或修改基类的行为。这种机制极大地提高了代码的复用性和可扩展性。

## 继承的基本概念

**基类（父类）**：被继承的类，也称为父类或超类。

**派生类（子类）**：继承基类的类，也称为子类。

继承的语法：

```cpp
class 派生类名 : 继承方式 基类名 {
    // 派生类新增的成员
};
```

## 继承方式

C++ 提供三种继承方式：

| 继承方式 | 基类 public 成员 | 基类 protected 成员 | 基类 private 成员 |
| --- | --- | --- | --- |
| public 继承 | public | protected | 不可访问 |
| protected 继承 | protected | protected | 不可访问 |
| private 继承 | private | private | 不可访问 |

```cpp
class Base {
public:
    int pub;
protected:
    int prot;
private:
    int priv;
};

// public 继承
class PublicDerived : public Base {
    // pub: public
    // prot: protected
    // priv: 不可访问
};

// protected 继承
class ProtectedDerived : protected Base {
    // pub: protected
    // prot: protected
    // priv: 不可访问
};

// private 继承
class PrivateDerived : private Base {
    // pub: private
    // prot: private
    // priv: 不可访问
};
```

## 单继承

最简单的继承形式，一个派生类只有一个基类。

```cpp
// 基类：动物
class Animal {
protected:
    string name;
    int age;

public:
    Animal(string n, int a) : name(n), age(a) {}

    void eat() {
        cout << name << " 在吃东西" << endl;
    }

    void sleep() {
        cout << name << " 在睡觉" << endl;
    }

    virtual void makeSound() {
        cout << name << " 发出声音" << endl;
    }
};

// 派生类：狗
class Dog : public Animal {
private:
    string breed;

public:
    Dog(string n, int a, string b) : Animal(n, a), breed(b) {}

    void makeSound() {
        cout << name << " 汪汪叫！" << endl;
    }

    void fetch() {
        cout << name << " 在捡球" << endl;
    }
};

// 派生类：猫
class Cat : public Animal {
private:
    bool isIndoor;

public:
    Cat(string n, int a, bool indoor) : Animal(n, a), isIndoor(indoor) {}

    void makeSound() {
        cout << name << " 喵喵叫！" << endl;
    }

    void climb() {
        cout << name << " 在爬树" << endl;
    }
};

int main() {
    Dog dog("旺财", 3, "金毛");
    dog.eat();        // 继承自 Animal
    dog.makeSound();  // 重写的方法
    dog.fetch();      // Dog 特有的方法

    Cat cat("咪咪", 2, true);
    cat.eat();        // 继承自 Animal
    cat.makeSound();  // 重写的方法
    cat.climb();      // Cat 特有的方法

    return 0;
}
```

## 派生类的构造函数

派生类构造函数需要调用基类的构造函数来初始化基类部分。

```cpp
class Vehicle {
protected:
    string brand;
    string model;

public:
    Vehicle(string b, string m) : brand(b), model(m) {
        cout << "Vehicle 构造函数" << endl;
    }

    void displayInfo() {
        cout << "品牌: " << brand << ", 型号: " << model << endl;
    }
};

class Car : public Vehicle {
private:
    int numDoors;
    string fuelType;

public:
    // 派生类构造函数，初始化列表调用基类构造函数
    Car(string b, string m, int doors, string fuel)
        : Vehicle(b, m), numDoors(doors), fuelType(fuel) {
        cout << "Car 构造函数" << endl;
    }

    void displayDetails() {
        displayInfo();
        cout << "车门数: " << numDoors << ", 燃料类型: " << fuelType << endl;
    }
};

int main() {
    Car myCar("Toyota", "Camry", 4, "汽油");
    myCar.displayDetails();

    return 0;
}
```

## 构造和析构顺序

```cpp
class A {
public:
    A() { cout << "A 构造函数" << endl; }
    ~A() { cout << "A 析构函数" << endl; }
};

class B {
public:
    B() { cout << "B 构造函数" << endl; }
    ~B() { cout << "B 析构函数" << endl; }
};

class C : public B, public A {
public:
    C() { cout << "C 构造函数" << endl; }
    ~C() { cout << "C 析构函数" << endl; }
};

// 输出顺序：
// B 构造函数（基类按声明顺序）
// A 构造函数
// C 构造函数（派生类）
// ...
// C 析构函数
// A 析构函数
// B 析构函数（与构造顺序相反）
```

## 多重继承

一个派生类可以有多个基类。

```cpp
class Teacher {
protected:
    string subject;

public:
    Teacher(string s) : subject(s) {}
    void teach() {
        cout << "教授 " << subject << endl;
    }
};

class Researcher {
protected:
    string field;

public:
    Researcher(string f) : field(f) {}
    void research() {
        cout << "研究 " << field << endl;
    }
};

// 多重继承
class Professor : public Teacher, public Researcher {
private:
    int yearsOfExperience;

public:
    Professor(string s, string f, int years)
        : Teacher(s), Researcher(f), yearsOfExperience(years) {}

    void introduce() {
        cout << "我是一位教授，";
        teach();
        research();
        cout << "工作经验: " << yearsOfExperience << " 年" << endl;
    }
};

int main() {
    Professor prof("计算机科学", "人工智能", 15);
    prof.introduce();

    return 0;
}
```

## 菱形继承问题

当多个基类继承自同一个基类时，会出现菱形继承问题。

```cpp
class A {
public:
    int value;
    A() : value(0) {}
};

class B : public A {};      // B 继承 A
class C : public A {};      // C 继承 A

// D 继承 B 和 C，会有两份 A 的副本
class D : public B, public C {
public:
    void display() {
        // B::value 和 C::value 是不同的变量
        cout << "B::value = " << B::value << endl;
        cout << "C::value = " << C::value << endl;
    }
};

// 使用虚继承解决菱形继承问题
class A_V {
public:
    int value;
    A_V() : value(0) {}
};

class B_V : virtual public A_V {};      // 虚继承
class C_V : virtual public A_V {};      // 虚继承

class D_V : public B_V, public C_V {
public:
    void display() {
        // 只有一份 A_V 的副本
        cout << "value = " << value << endl;
    }
};
```

## 访问控制与名称遮蔽

```cpp
class Base {
public:
    void display() {
        cout << "Base::display()" << endl;
    }

    void show(int x) {
        cout << "Base::show(int) = " << x << endl;
    }
};

class Derived : public Base {
public:
    // 名称遮蔽：派生类的 display 遮蔽了基类的 display
    void display() {
        cout << "Derived::display()" << endl;
    }

    // 新的 show 函数，遮蔽了基类的 show(int)
    void show(double x) {
        cout << "Derived::show(double) = " << x << endl;
    }

    void test() {
        display();           // 调用 Derived::display()
        Base::display();     // 调用 Base::display()

        show(3.14);           // 调用 Derived::show(double)
        // show(10);         // 编译错误，遮蔽了 show(int)
        Base::show(10);      // 调用 Base::show(int)
    }
};
```

## 向上转型与向下转型

```cpp
class Shape {
public:
    virtual void draw() {
        cout << "绘制形状" << endl;
    }
};

class Circle : public Shape {
public:
    void draw() override {
        cout << "绘制圆形" << endl;
    }
};

class Rectangle : public Shape {
public:
    void draw() override {
        cout << "绘制矩形" << endl;
    }
};

int main() {
    Circle circle;
    Rectangle rect;

    // 向上转型（安全，自动转换）
    Shape* shape1 = &circle;   // Circle* 转 Shape*
    Shape& shape2 = rect;      // Rectangle& 转 Shape&

    shape1->draw();  // 调用 Circle::draw()（多态）
    shape2.draw();   // 调用 Rectangle::draw()（多态）

    // 向下转型（不安全，需要检查）
    Shape* base = new Circle();

    // 使用 dynamic_cast 进行安全的向下转型
    Circle* c = dynamic_cast<Circle*>(base);
    if (c) {
        c->draw();  // 安全调用
    }

    Rectangle* r = dynamic_cast<Rectangle*>(base);
    if (!r) {
        cout << "转换失败" << endl;
    }

    delete base;
    return 0;
}
```

## protected 成员的使用

```cpp
class BankAccount {
protected:
    string accountNumber;
    double balance;

public:
    BankAccount(string num, double bal) : accountNumber(num), balance(bal) {}

    void deposit(double amount) {
        balance += amount;
    }

    void withdraw(double amount) {
        if (amount <= balance) {
            balance -= amount;
        }
    }

    double getBalance() const {
        return balance;
    }
};

class SavingsAccount : public BankAccount {
private:
    double interestRate;

public:
    SavingsAccount(string num, double bal, double rate)
        : BankAccount(num, bal), interestRate(rate) {}

    void addInterest() {
        balance += balance * interestRate;  // 可以访问 protected 成员
    }

    void applyBonus() {
        if (balance > 10000) {
            balance += 100;  // 可以访问 protected 成员
        }
    }
};
```

## 总结

| 概念 | 说明 |
| --- | --- |
| 基类 | 被继承的类 |
| 派生类 | 继承基类的类 |
| public 继承 | 保持基类成员的访问权限 |
| protected 继承 | 将基类 public 成员变为 protected |
| private 继承 | 将基类 public 和 protected 成员变为 private |
| 虚继承 | 解决菱形继承问题 |
| 向上转型 | 派生类指针/引用转为基类（安全） |
| 向下转型 | 基类指针/引用转为派生类（需检查） |

继承是 C++ 中实现代码复用和层次结构设计的重要机制。通过继承，我们可以构建清晰的类层次结构，实现”is-a”关系。下一篇文章我们将学习面向对象编程的核心概念——多态和虚函数。
