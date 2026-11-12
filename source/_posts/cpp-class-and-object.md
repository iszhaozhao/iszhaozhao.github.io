---
title: "C++学习笔记 - 类和对象"
date: 2023-03-15 12:00:00
updated: 2026-03-17 12:00:00
categories:
  - "C++"
tags:
  - "C++"
  - "面向对象"
  - "类"
  - "对象"
---
## 前言

C++ 是一门支持面向对象编程（OOP）的编程语言，类和对象是面向对象编程的核心概念。这篇笔记将详细介绍 C++ 中类和对象的基本概念与使用方法。

## 类的定义

类是用户自定义的数据类型，它将数据和操作数据的方法封装在一起。类的定义使用关键字 `class`。

```cpp
class Student {
private:
    string name;
    int age;
    double score;

public:
    // 构造函数
    Student(string n, int a, double s) {
        name = n;
        age = a;
        score = s;
    }

    // 成员函数
    void display() {
        cout << "姓名: " << name << endl;
        cout << "年龄: " << age << endl;
        cout << "成绩: " << score << endl;
    }

    // Getter 方法
    string getName() { return name; }
    int getAge() { return age; }
    double getScore() { return score; }

    // Setter 方法
    void setScore(double s) { score = s; }
};
```

## 访问修饰符

C++ 提供了三种访问修饰符来控制类成员的访问权限：

| 修饰符 | 访问权限 |
| --- | --- |
| `public` | 公有成员，可以从任何地方访问 |
| `private` | 私有成员，只能在类内部访问 |
| `protected` | 受保护成员，在类及其派生类中可访问 |

## 对象的创建与使用

对象是类的实例化，创建对象的过程称为实例化。

```cpp
int main() {
    // 创建对象
    Student s1("张三", 20, 95.5);

    // 调用成员函数
    s1.display();

    // 使用 getter 和 setter
    cout << "姓名: " << s1.getName() << endl;
    s1.setScore(98.0);
    cout << "更新后成绩: " << s1.getScore() << endl;

    return 0;
}
```

## 构造函数与析构函数

### 构造函数

构造函数是在创建对象时自动调用的特殊成员函数，用于初始化对象。

```cpp
class Point {
private:
    int x, y;

public:
    // 默认构造函数
    Point() {
        x = 0;
        y = 0;
    }

    // 带参数的构造函数
    Point(int a, int b) {
        x = a;
        y = b;
    }

    // 拷贝构造函数
    Point(const Point& p) {
        x = p.x;
        y = p.y;
    }

    void display() {
        cout << "(" << x << ", " << y << ")" << endl;
    }
};
```

### 析构函数

析构函数在对象销毁时自动调用，用于释放资源。

```cpp
class DynamicArray {
private:
    int* data;
    int size;

public:
    DynamicArray(int n) {
        size = n;
        data = new int[n];
        cout << "构造函数调用" << endl;
    }

    ~DynamicArray() {
        delete[] data;
        cout << "析构函数调用" << endl;
    }
};
```

## this 指针

`this` 指针指向当前对象的地址，可以在成员函数中使用。

```cpp
class Person {
private:
    string name;

public:
    Person& setName(string n) {
        this->name = n;  // 使用 this 指针
        return *this;     // 返回对象引用
    }

    void printName() {
        cout << "Name: " << this->name << endl;
    }
};
```

## 静态成员

静态成员属于类本身，而不是类的某个对象。

```cpp
class Counter {
private:
    static int count;  // 静态成员变量

public:
    Counter() {
        count++;
    }

    ~Counter() {
        count--;
    }

    static int getCount() {  // 静态成员函数
        return count;
    }
};

// 静态成员变量需要在类外初始化
int Counter::count = 0;
```

## 友元函数

友元函数可以访问类的私有成员。

```cpp
class Box {
private:
    double width;

public:
    Box(double w) : width(w) {}

    friend void printWidth(Box box);
};

void printWidth(Box box) {
    cout << "Width: " << box.width << endl;
}
```

## const 成员函数

`const` 成员函数不会修改对象的成员变量。

```cpp
class Circle {
private:
    double radius;

public:
    Circle(double r) : radius(r) {}

    // const 成员函数
    double getArea() const {
        return 3.14159 * radius * radius;
    }

    double getPerimeter() const {
        return 2 * 3.14159 * radius;
    }
};
```

## 总结

| 概念 | 说明 |
| --- | --- |
| 类 | 用户自定义的数据类型 |
| 对象 | 类的实例 |
| 构造函数 | 初始化对象 |
| 析构函数 | 清理资源 |
| this 指针 | 指向当前对象 |
| 静态成员 | 属于类而非对象 |
| 友元函数 | 可访问私有成员 |
| const 成员函数 | 不修改对象状态 |

类和对象是 C++ 面向对象编程的基础，掌握这些知识是深入学习 C++ 的第一步。下一篇文章我们将学习运算符重载。
