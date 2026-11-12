---
title: "C++学习笔记 - 多态和虚函数"
date: 2023-06-15 12:00:00
updated: 2026-03-17 12:00:00
categories:
  - "C++"
tags:
  - "C++"
  - "面向对象"
  - "多态"
  - "虚函数"
  - "纯虚函数"
  - "抽象类"
---
## 前言

多态是面向对象编程的三大特性之一，也是 C++ 中最强大的特性之一。多态允许使用统一的接口来操作不同类型的对象，实现”一个接口，多种实现”。虚函数是实现多态的关键机制。

## 什么是多态

多态是指相同的函数调用，根据对象类型的不同，表现出不同的行为。

C++ 中有两种多态：

| 类型 | 实现时机 | 例子 |
| --- | --- | --- |
| 静态多态（编译时） | 编译期确定 | 函数重载、运算符重载、模板 |
| 动态多态（运行时） | 运行期确定 | 虚函数 |

## 静态多态

### 函数重载

```cpp
class Calculator {
public:
    int add(int a, int b) {
        return a + b;
    }

    double add(double a, double b) {
        return a + b;
    }

    string add(const string& a, const string& b) {
        return a + b;
    }
};
```

### 运算符重载

```cpp
class Vector2D {
public:
    int x, y;

    Vector2D(int x = 0, int y = 0) : x(x), y(y) {}

    Vector2D operator+(const Vector2D& other) const {
        return Vector2D(x + other.x, y + other.y);
    }
};
```

## 动态多态与虚函数

动态多态通过虚函数和继承实现，使用基类指针或引用调用派生类的方法。

### 虚函数的基本语法

```cpp
class Animal {
public:
    // 声明虚函数
    virtual void makeSound() {
        cout << "动物发出声音" << endl;
    }

    virtual ~Animal() {}  // 虚析构函数
};

class Dog : public Animal {
public:
    void makeSound() override {  // override 关键字表示重写
        cout << "汪汪！" << endl;
    }
};

class Cat : public Animal {
public:
    void makeSound() override {
        cout << "喵喵！" << endl;
    }
};

int main() {
    Animal* animals[3];
    animals[0] = new Animal();
    animals[1] = new Dog();
    animals[2] = new Cat();

    for (int i = 0; i < 3; i++) {
        animals[i]->makeSound();  // 多态调用
    }

    for (int i = 0; i < 3; i++) {
        delete animals[i];  // 安全删除（因为有虚析构函数）
    }

    return 0;
}
```

### 虚函数表（vtable）

每个包含虚函数的类都有一个虚函数表（vtable），包含该类所有虚函数的地址。

```cpp
class Base {
public:
    virtual void func1() { cout << "Base::func1" << endl; }
    virtual void func2() { cout << "Base::func2" << endl; }
};

class Derived : public Base {
public:
    void func1() override { cout << "Derived::func1" << endl; }
    void func2() override { cout << "Derived::func2" << endl; }
};

// Base 的 vtable:
// func1 -> Base::func1
// func2 -> Base::func2

// Derived 的 vtable:
// func1 -> Derived::func1
// func2 -> Derived::func2
```

## override 和 final 关键字

C++11 引入了 `override` 和 `final` 关键字，帮助避免错误。

### override

明确表示函数是重写基类的虚函数，编译器会检查。

```cpp
class Base {
public:
    virtual void func() {}
};

class Derived : public Base {
public:
    void func() override {}      // 正确
    void func() const override {} // 错误：函数签名不匹配
    void func(int) override {}    // 错误：基类没有这个函数
};
```

### final

防止类被继承或防止虚函数被重写。

```cpp
class FinalClass final {  // 不能被继承
public:
    virtual void func() {}
};

class Child : public FinalClass {};  // 编译错误

class Base {
public:
    virtual void func() final {}  // 不能被重写
};

class Derived : public Base {
public:
    void func() override {}  // 编译错误
};
```

## 纯虚函数与抽象类

### 纯虚函数

纯虚函数是没有实现的虚函数，语法为 `virtual 函数类型 函数名(参数) = 0;`

```cpp
class Shape {
public:
    // 纯虚函数
    virtual double area() = 0;
    virtual double perimeter() = 0;

    // 可以有具体实现
    void display() {
        cout << "面积: " << area() << endl;
        cout << "周长: " << perimeter() << endl;
    }

    virtual ~Shape() = default;
};
```

### 抽象类

包含至少一个纯虚函数的类称为抽象类，不能实例化。

```cpp
class Circle : public Shape {
private:
    double radius;

public:
    Circle(double r) : radius(r) {}

    double area() override {
        return 3.14159 * radius * radius;
    }

    double perimeter() override {
        return 2 * 3.14159 * radius;
    }
};

class Rectangle : public Shape {
private:
    double width, height;

public:
    Rectangle(double w, double h) : width(w), height(h) {}

    double area() override {
        return width * height;
    }

    double perimeter() override {
        return 2 * (width + height);
    }
};

int main() {
    // Shape s;  // 错误：抽象类不能实例化

    Shape* shapes[2];
    shapes[0] = new Circle(5.0);
    shapes[1] = new Rectangle(4.0, 6.0);

    for (int i = 0; i < 2; i++) {
        shapes[i]->display();
        delete shapes[i];
    }

    return 0;
}
```

## 虚析构函数

当基类指针指向派生类对象时，需要虚析构函数来正确释放派生类的资源。

```cpp
class Resource {
protected:
    char* data;

public:
    Resource(size_t size) {
        data = new char[size];
        cout << "Resource 构造" << endl;
    }

    // 虚析构函数
    virtual ~Resource() {
        delete[] data;
        cout << "Resource 析构" << endl;
    }
};

class FileResource : public Resource {
private:
    FILE* file;

public:
    FileResource(size_t size, const char* filename)
        : Resource(size) {
        file = fopen(filename, "w");
        cout << "FileResource 构造" << endl;
    }

    ~FileResource() override {
        if (file) {
            fclose(file);
        }
        cout << "FileResource 析构" << endl;
    }
};

int main() {
    Resource* res = new FileResource(1024, "test.txt");
    delete res;  // 正确调用 FileResource::~FileResource()

    return 0;
}
```

## 实际应用：图形编辑器

```cpp
#include <vector>

// 图形基类
class Graphic {
public:
    virtual ~Graphic() = default;
    virtual void draw() const = 0;
    virtual void move(int dx, int dy) = 0;
    virtual void resize(double scale) = 0;
};

// 点
class Point : public Graphic {
private:
    int x, y;

public:
    Point(int x = 0, int y = 0) : x(x), y(y) {}

    void draw() const override {
        cout << "绘制点 (" << x << ", " << y << ")" << endl;
    }

    void move(int dx, int dy) override {
        x += dx;
        y += dy;
    }

    void resize(double scale) override {
        x *= scale;
        y *= scale;
    }
};

// 线
class Line : public Graphic {
private:
    Point start, end;

public:
    Line(const Point& s, const Point& e) : start(s), end(e) {}

    void draw() const override {
        cout << "绘制线" << endl;
        start.draw();
        end.draw();
    }

    void move(int dx, int dy) override {
        start.move(dx, dy);
        end.move(dx, dy);
    }

    void resize(double scale) override {
        start.resize(scale);
        end.resize(scale);
    }
};

// 圆
class Circle : public Graphic {
private:
    Point center;
    int radius;

public:
    Circle(const Point& c, int r) : center(c), radius(r) {}

    void draw() const override {
        cout << "绘制圆：中心 ";
        center.draw();
        cout << "半径: " << radius << endl;
    }

    void move(int dx, int dy) override {
        center.move(dx, dy);
    }

    void resize(double scale) override {
        radius *= scale;
    }
};

// 图形编辑器
class GraphicEditor {
private:
    vector<Graphic*> graphics;

public:
    void addGraphic(Graphic* g) {
        graphics.push_back(g);
    }

    void drawAll() const {
        cout << "=== 绘制所有图形 ===" << endl;
        for (const auto& g : graphics) {
            g->draw();
        }
    }

    void moveAll(int dx, int dy) {
        for (auto& g : graphics) {
            g->move(dx, dy);
        }
    }

    void resizeAll(double scale) {
        for (auto& g : graphics) {
            g->resize(scale);
        }
    }

    ~GraphicEditor() {
        for (auto& g : graphics) {
            delete g;
        }
    }
};

int main() {
    GraphicEditor editor;

    editor.addGraphic(new Point(10, 20));
    editor.addGraphic(new Point(30, 40));
    editor.addGraphic(new Line(Point(0, 0), Point(100, 100)));
    editor.addGraphic(new Circle(Point(50, 50), 25));

    editor.drawAll();

    cout << "\n移动所有图形 (dx=10, dy=5)" << endl;
    editor.moveAll(10, 5);
    editor.drawAll();

    cout << "\n缩放所有图形 (scale=2)" << endl;
    editor.resizeAll(2);
    editor.drawAll();

    return 0;
}
```

## 接口类

在 C++ 中，接口通常通过只包含纯虚函数的抽象类来实现。

```cpp
// 可绘制接口
class IDrawable {
public:
    virtual ~IDrawable() = default;
    virtual void draw() const = 0;
};

// 可移动接口
class IMovable {
public:
    virtual ~IMovable() = default;
    virtual void move(int dx, int dy) = 0;
};

// 可缩放接口
class IResizable {
public:
    virtual ~IResizable() = default;
    virtual void resize(double scale) = 0;
};

// 一个类可以实现多个接口
class Sprite : public IDrawable, public IMovable, public IResizable {
private:
    int x, y;
    double size;

public:
    Sprite(int x, int y, double size) : x(x), y(y), size(size) {}

    void draw() const override {
        cout << "Sprite at (" << x << ", " << y << "), size=" << size << endl;
    }

    void move(int dx, int dy) override {
        x += dx;
        y += dy;
    }

    void resize(double scale) override {
        size *= scale;
    }
};
```

## 动态绑定 vs 静态绑定

```cpp
class Base {
public:
    void nonVirtualFunc() {
        cout << "Base::nonVirtualFunc (静态绑定)" << endl;
    }

    virtual void virtualFunc() {
        cout << "Base::virtualFunc (动态绑定)" << endl;
    }
};

class Derived : public Base {
public:
    void nonVirtualFunc() {
        cout << "Derived::nonVirtualFunc (静态绑定)" << endl;
    }

    void virtualFunc() override {
        cout << "Derived::virtualFunc (动态绑定)" << endl;
    }
};

int main() {
    Derived d;
    Base* bp = &d;

    // 静态绑定：根据指针类型决定
    bp->nonVirtualFunc();  // 输出: Base::nonVirtualFunc

    // 动态绑定：根据实际对象类型决定
    bp->virtualFunc();     // 输出: Derived::virtualFunc

    return 0;
}
```

## 总结

| 概念 | 说明 |
| --- | --- |
| 静态多态 | 编译时确定，如函数重载、运算符重载 |
| 动态多态 | 运行时确定，通过虚函数实现 |
| 虚函数 | 使用 `virtual` 声明，支持动态绑定 |
| 纯虚函数 | 没有实现的虚函数 `= 0` |
| 抽象类 | 包含纯虚函数的类，不能实例化 |
| 虚析构函数 | 确保正确调用派生类析构函数 |
| override | 明确表示重写虚函数 |
| final | 防止类被继承或函数被重写 |
| vtable | 虚函数表，存储虚函数地址 |
| 接口类 | 只包含纯虚函数的抽象类 |

多态是面向对象编程的核心，它允许我们编写灵活、可扩展的代码。通过虚函数，我们可以实现”一个接口，多种实现”，使代码更加模块化和易于维护。

这四篇 C++ 学习笔记涵盖了面向对象编程的核心概念：类和对象、运算符重载、继承和派生、多态和虚函数。掌握这些知识，你就可以开始编写更加优雅和强大的 C++ 程序了！
