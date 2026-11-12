---
title: "C++学习笔记 - 运算符重载"
date: 2023-04-15 12:00:00
updated: 2026-03-17 12:00:00
categories:
  - "C++"
tags:
  - "C++"
  - "面向对象"
  - "运算符重载"
---
## 前言

运算符重载是 C++ 的一个强大特性，它允许我们为自定义类型（类）重新定义运算符的行为。这样可以让自定义类型的对象像内置类型一样自然地使用各种运算符。

## 运算符重载的基本语法

运算符重载通过定义特殊的成员函数或友元函数来实现。

```cpp
// 成员函数形式
ReturnType operatorOP(Parameters);

// 友元函数形式
friend ReturnType operatorOP(Parameters, ClassType);
```

## 可重载的运算符

| 类型 | 运算符 |
| --- | --- |
| 算术运算符 | `+`, `-`, `*`, `/`, `%` |
| 关系运算符 | `==`, `!=`, `<`, `>`, `<=`, `>=` |
| 逻辑运算符 | `&&`, `\|\|`, `!` |
| 位运算符 | `&`, `\|`, `^`, `~`, `<<`, `>>` |
| 赋值运算符 | `=`, `+=`, `-=`, `*=`, `/=`, `%=` |
| 自增自减 | `++`, `--` |
| 下标运算符 | `[]` |
| 函数调用运算符 | `()` |
| 成员访问运算符 | `->`, `->*` |

## 算术运算符重载

### 二元运算符

```cpp
class Complex {
private:
    double real, imag;

public:
    Complex(double r = 0, double i = 0) : real(r), imag(i) {}

    // 重载 + 运算符（成员函数）
    Complex operator+(const Complex& other) const {
        return Complex(real + other.real, imag + other.imag);
    }

    // 重载 - 运算符（友元函数）
    friend Complex operator-(const Complex& a, const Complex& b) {
        return Complex(a.real - b.real, a.imag - b.imag);
    }

    // 重载 * 运算符
    Complex operator*(const Complex& other) const {
        return Complex(
            real * other.real - imag * other.imag,
            real * other.imag + imag * other.real
        );
    }

    void display() const {
        cout << real << " + " << imag << "i" << endl;
    }
};

int main() {
    Complex c1(3, 4);
    Complex c2(1, 2);

    Complex c3 = c1 + c2;  // 使用重载的 + 运算符
    c3.display();  // 输出: 4 + 6i

    Complex c4 = c1 - c2;  // 使用重载的 - 运算符
    c4.display();  // 输出: 2 + 2i

    Complex c5 = c1 * c2;  // 使用重载的 * 运算符
    c5.display();  // 输出: -5 + 10i

    return 0;
}
```

## 输入输出运算符重载

重载 `<<` 和 `>>` 运算符可以让我们直接使用 `cin` 和 `cout` 输入输出自定义对象。

```cpp
class Point {
private:
    int x, y;

public:
    Point(int x = 0, int y = 0) : x(x), y(y) {}

    // 重载输出运算符 <<
    friend ostream& operator<<(ostream& os, const Point& p) {
        os << "(" << p.x << ", " << p.y << ")";
        return os;
    }

    // 重载输入运算符 >>
    friend istream& operator>>(istream& is, Point& p) {
        is >> p.x >> p.y;
        return is;
    }
};

int main() {
    Point p1(10, 20);
    Point p2;

    cout << "p1 = " << p1 << endl;  // 输出: p1 = (10, 20)

    cout << "请输入坐标 (x y): ";
    cin >> p2;
    cout << "p2 = " << p2 << endl;

    return 0;
}
```

## 关系运算符重载

```cpp
class String {
private:
    char* str;
    int len;

public:
    String(const char* s = "") {
        len = strlen(s);
        str = new char[len + 1];
        strcpy(str, s);
    }

    ~String() {
        delete[] str;
    }

    // 重载 == 运算符
    bool operator==(const String& other) const {
        return strcmp(str, other.str) == 0;
    }

    // 重载 != 运算符
    bool operator!=(const String& other) const {
        return !(*this == other);
    }

    // 重载 < 运算符
    bool operator<(const String& other) const {
        return strcmp(str, other.str) < 0;
    }

    friend ostream& operator<<(ostream& os, const String& s) {
        os << s.str;
        return os;
    }
};
```

## 赋值运算符重载

```cpp
class MyString {
private:
    char* data;

public:
    MyString(const char* str = "") {
        data = new char[strlen(str) + 1];
        strcpy(data, str);
    }

    // 拷贝构造函数
    MyString(const MyString& other) {
        data = new char[strlen(other.data) + 1];
        strcpy(data, other.data);
    }

    // 赋值运算符重载
    MyString& operator=(const MyString& other) {
        if (this != &other) {  // 防止自赋值
            delete[] data;  // 释放原有内存
            data = new char[strlen(other.data) + 1];
            strcpy(data, other.data);
        }
        return *this;
    }

    ~MyString() {
        delete[] data;
    }
};
```

## 下标运算符重载

```cpp
class Array {
private:
    int* data;
    int size;

public:
    Array(int n) : size(n) {
        data = new int[size];
        for (int i = 0; i < size; i++) {
            data[i] = 0;
        }
    }

    // 重载 [] 运算符（非 const 版本）
    int& operator[](int index) {
        if (index < 0 || index >= size) {
            throw out_of_range("Index out of range");
        }
        return data[index];
    }

    // 重载 [] 运算符（const 版本）
    const int& operator[](int index) const {
        if (index < 0 || index >= size) {
            throw out_of_range("Index out of range");
        }
        return data[index];
    }

    ~Array() {
        delete[] data;
    }
};
```

## 自增自减运算符重载

```cpp
class Counter {
private:
    int value;

public:
    Counter(int v = 0) : value(v) {}

    // 前置 ++ (++obj)
    Counter& operator++() {
        ++value;
        return *this;
    }

    // 后置 ++ (obj++)
    Counter operator++(int) {
        Counter temp = *this;
        value++;
        return temp;
    }

    // 前置 -- (--obj)
    Counter& operator--() {
        --value;
        return *this;
    }

    // 后置 -- (obj--)
    Counter operator--(int) {
        Counter temp = *this;
        value--;
        return temp;
    }

    void display() const {
        cout << "Value: " << value << endl;
    }
};

int main() {
    Counter c(5);

    c.display();  // 输出: Value: 5

    ++c;          // 前置递增
    c.display();  // 输出: Value: 6

    c++;          // 后置递增
    c.display();  // 输出: Value: 7

    --c;          // 前置递减
    c.display();  // 输出: Value: 6

    c--;          // 后置递减
    c.display();  // 输出: Value: 5

    return 0;
}
```

## 函数调用运算符重载

```cpp
class Adder {
private:
    int offset;

public:
    Adder(int n) : offset(n) {}

    // 重载 () 运算符
    int operator()(int a, int b) {
        return a + b + offset;
    }
};

int main() {
    Adder add10(10);  // 偏移量为10的加法器

    cout << add10(5, 3) << endl;  // 输出: 18 (5 + 3 + 10)

    return 0;
}
```

## 智能指针运算符重载

```cpp
class SmartPtr {
private:
    int* ptr;

public:
    SmartPtr(int* p = nullptr) : ptr(p) {}

    ~SmartPtr() {
        delete ptr;
    }

    // 重载 -> 运算符
    int* operator->() {
        return ptr;
    }

    // 重载 * 运算符
    int& operator*() {
        return *ptr;
    }

    // 重载 bool 转换
    operator bool() const {
        return ptr != nullptr;
    }
};

class Box {
public:
    int value;
    Box(int v) : value(v) {}
};

int main() {
    SmartPtr sp(new int(42));
    cout << *sp << endl;  // 输出: 42

    if (sp) {
        cout << "指针有效" << endl;
    }

    return 0;
}
```

## 注意事项

1. **不能重载的运算符**：
   - `.`（成员访问运算符）
   - `.*`（成员指针访问运算符）
   - `::`（作用域解析运算符）
   - `?:`（条件运算符）
   - `sizeof`（大小运算符）
   - `typeid`（类型识别运算符）

2. **保持原有语义**：重载运算符时应尽量保持其原有语义，不要让用户产生混淆。

3. **成员函数 vs 友元函数**：
   - 一元运算符通常使用成员函数
   - `=`、`[]`、`()`、`->` 必须作为成员函数
   - 输入输出运算符 `<<`、`>>` 必须作为友元函数

## 总结

运算符重载让 C++ 的自定义类型可以像内置类型一样自然地使用各种运算符，提高了代码的可读性和易用性。但同时也要注意，过度或不恰当的运算符重载可能会降低代码的可维护性，应合理使用。

| 运算符类型 | 典型用途 |
| --- | --- |
| 算术运算符 | 自定义数学运算 |
| 关系运算符 | 对象比较 |
| 输入输出运算符 | 对象的 I/O 操作 |
| 下标运算符 | 容器类 |
| 赋值运算符 | 对象的拷贝 |
| 自增自减 | 迭代器类 |

下一篇文章我们将学习 C++ 的继承和派生。
