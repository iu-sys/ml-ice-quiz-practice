# ML ICE Klausur Notes

考試：Machine Learning M-ICE  
範圍：每週 Quiz 內容  
重點順序：先看 Clustering / Perceptron，再補 NCC，最後快速複習 Python、NumPy、KNN、Feature Extraction、Model Evaluation。

## 1. Python Intro

### Python collection

- `list`: `[1, 2, 3]`
  - 可修改 mutable。
  - 可混合不同資料型別，例如 `[1, "b", True, 3]` 合法。
- `tuple`: `(1, 2, 3)`
  - 不可修改 immutable。
  - `a = (1, 2, 3); a[0] = "foo"` 會失敗。
- `set`: `{1, 2, 3}`
  - 不重複、沒有固定順序。
- `dict`: `{"1": 1, "2": 2}`
  - key-value 結構。
  - `{"foo": 0, "bar": 1}[0]` 不會回傳 `"foo"`，因為 key 是 `"foo"` 不是 `0`。

### Class / object

```python
class G():
    def __init__(self, a):
        self.a = a
```

- `g = G("a")` 後，`g.a` 會是 `"a"`。
- `g = G()` 會失敗，因為 `__init__` 需要參數 `a`。

### List slicing

```python
L = [3, 5, 2, 7, 9]
```

- `L[:2]` 是 `[3, 5]`，不包含 index 2。
- `L[::-1]` 是反轉：`[9, 7, 2, 5, 3]`。
- `L[-3:]` 是最後三個：`[2, 7, 9]`。

### Reference vs new object

```python
x = 2
y = x
x = x + 1
```

- 結果：`x = 3`, `y = 2`
- int 是 immutable，重新賦值不會改到 `y`。

```python
x = [2]
y = x
x = x + [1]
```

- 結果：`x = [2, 1]`, `y = [2]`
- `x + [1]` 產生新 list。

```python
x = [2]
y = x
x.append(1)
```

- 結果：`x = [2, 1]`, `y = [2, 1]`
- `append` 會改原本同一個 list。

### 小心點

- `4 in [1, 2, 3]` 是 `False`。
- list comprehension 裡要用元素變數，不是整個 list：

```python
[y for y in x if y % 2 == 0]
```

## 2. Vector / Matrix Operations

### NumPy array basics

```python
import numpy as np
v = np.array([2, 5, 3])
```

- scalar multiplication:

```python
v * 0.25
# array([0.5, 1.25, 0.75])
```

- vector addition 是 element-wise：

```python
np.array([4, 1, 8]) + np.array([2, 5, 3])
# array([6, 6, 11])
```

### Dot product / scalar product

```python
a = np.array([4, 1, 8])
v = np.array([2, 5, 3])
a @ v
```

計算：

```text
4*2 + 1*5 + 8*3 = 8 + 5 + 24 = 37
```

### Unit norm normalization

要讓 `w @ w == 1`：

```python
w = v / np.sqrt(v @ v)
```

也就是：

```text
w = v / ||v||
```

### Matrix-vector product

```python
X = np.array([[2, 4], [-1, 4], [0, 8]])
w = np.array([1, 5])
X @ w
```

逐列 dot product：

```text
[2*1 + 4*5, -1*1 + 4*5, 0*1 + 8*5]
= [22, 19, 40]
```

### Broadcasting

```python
np.array([[2, 5], [4, 1]]) + np.array([1, 2])
```

第二個 array 會加到每一列：

```text
[[3, 7],
 [5, 3]]
```

### Euclidean distance

```python
def dist(a, b):
    return np.sqrt(((a - b) ** 2).sum())
```

或：

```python
np.linalg.norm(a - b)
```

多筆資料 `X` 和一個點 `y` 的距離：

```python
np.linalg.norm(X - y, axis=1)
```

或：

```python
np.sqrt(np.sum((X - y) ** 2, axis=1))
```

### Summary statistics

常用：

```python
np.mean(x)
np.percentile(x, 25)
np.min(x)
np.std(x)
```

Histogram：

```python
import matplotlib.pyplot as plt
plt.hist(heights)
```

## 3. NCC and Linear Classification

NCC = Nearest Centroid Classification.

### Concept

- 每一個 class 用一個 centroid / prototype 表示。
- 新資料點會被分到最近 centroid 的 class。
- centroid 通常是該 class 所有資料點的平均向量。

### Compute class mean vector

```python
X = np.array([[3, 1], [4, 2], [2, -1], [4, -1]])
y = np.array([-1, 1, 1, -1])
```

label `-1` 的 mean vector：

```python
X[y == -1, :].mean(axis=0)
```

注意：

- `axis=0`：對 rows 取平均，得到每個 feature 的平均。
- `axis=1`：對 columns 取平均，會得到每個 sample 自己的平均，這裡不對。
- `X[y < 0, :].mean()` 少了 `axis=0`，會變成全部數字平均，不是向量。

### Decision boundary

Binary NCC 的 decision boundary：

- 在兩個 class centroid 中間。
- 與兩個 centroid 的差向量 orthogonal。
- 是 linear boundary。

### Linear vs non-linear

- Linear classifier 只能學 linear decision boundary。
- 如果資料不能被 linear classifier 分好，可以用 non-linear transformation / feature mapping，轉換後再用 linear classifier。
- NCC 不考慮每個 class 的 variance，只看 centroid。

### 常考 NumPy 寫法

單一距離：

```python
np.linalg.norm(x - y)
```

多筆距離：

```python
np.linalg.norm(X - y, axis=1)
```

## 4. KNN

KNN = K-Nearest Neighbors.

### Algorithm

給一個新資料點 `x`：

1. 計算 `x` 到 training data 裡每個點的距離。
2. 找出最近的 `k` 個 neighbors。
3. 回傳這 `k` 個 neighbors 中最常見的 label。

### No training phase

- KNN 幾乎沒有真正的 training phase。
- model 本身就是 training data。
- prediction 時才計算距離，所以資料越多，prediction 通常越慢。

### Hyperparameter k

- `k` 小：decision boundary 較複雜，容易 overfit。
- `k` 大：decision boundary 較平滑，較簡單。
- 減少 `k` 不一定提高 test performance。

### Find nearest neighbors in NumPy

```python
distances = np.linalg.norm(X - x, axis=1)
idx = distances.argsort()[:k]
```

注意：

- `argsort()[:k]` 取最小的 k 個距離。
- `argsort()[-k:]` 取最大距離那邊，不是 nearest。
- 如果 `x` 不在 `X` 裡，不需要跳過第一個。

## 5. Feature Extraction

### n-gram bag-of-words

- n-gram 是長度為 `n` 的 token sequence。
- n-gram feature 通常記錄 token sequence 的 count。
- 文字特徵向量通常非常 sparse：大部分值是 0。
- vocabulary 越大，feature dimension 和 memory cost 越高。

例子：

- unigram：`machine`, `learning`
- bigram：`machine learning`
- trigram：`intro to machine`

### One-hot encoding

資料：

```python
[["large"], ["small"], ["medium"], ["small"], ["large"]]
```

如果類別順序是 `large, medium, small`，則 one-hot 可寫成：

```text
large  -> [1, 0, 0]
medium -> [0, 1, 0]
small  -> [0, 0, 1]
```

所以整體會是：

```text
[[1, 0, 0],
 [0, 0, 1],
 [0, 1, 0],
 [0, 0, 1],
 [1, 0, 0]]
```

### ML Pipeline

Pipeline 通常包含：

1. Feature extractor / transformer
2. ML model / predictor

重點：

- feature extraction 的 hyperparameters 也要調，不只 model hyperparameters。
- pipeline 可以避免 preprocessing 和 model 分開導致的錯誤。
- 自訂 feature extraction 放進 pipeline 可能需要額外實作。

## 6. Model Evaluation

### ML systems

- ML model 從 data 學 rule / pattern。
- ML system 不是一般 deterministic software，不能只用普通軟體測試方式。
- 參數很多的模型可能記住 training data，但不代表 generalize 到新資料。

### Train / test split

固定 hyperparameters，只做訓練和評估，至少需要：

1. Training set
2. Test set

所以至少 2 splits。

如果要做 model selection / hyperparameter tuning，通常需要：

1. Training set
2. Validation set
3. Test set

### Metrics

Accuracy：

```text
correct predictions / all predictions
```

Precision：

```text
TP / (TP + FP)
```

Recall：

```text
TP / (TP + FN)
```

F1：

```text
2 * precision * recall / (precision + recall)
```

### Imbalanced data

- 如果 positive class 是 30%，negative class 是 70%：
  - 永遠預測 positive，accuracy = 30%。
  - 永遠預測 negative，accuracy = 70%。
- 所以 imbalanced data 只看 accuracy 可能誤導。
- Precision 高不代表 accuracy 一定高。

## 7. Clustering

這一章你 LMS 沒有顯示已完成分數，建議優先看。

### Supervised vs unsupervised

- Classification：有 labels，目標是預測 class。
- Clustering：沒有 labels，目標是找資料內部結構。

### K-Means concept

K-Means 的目標：

- 把資料分成 `k` 個 clusters。
- 每個 cluster 有一個 centroid。
- 每個點分到最近的 centroid。
- 更新 centroid 為 cluster 中所有點的平均。
- 重複 assign / update，直到結果穩定。

### K-Means steps

1. 選 `k`。
2. 初始化 `k` 個 centroids。
3. Assignment step：每個點分給最近 centroid。
4. Update step：每個 centroid 更新為該 cluster 平均。
5. 重複直到 labels 或 centroids 不再改變。

### Important properties

- K-Means 對 initialization 敏感。
- 需要先決定 `k`。
- 適合 roughly spherical / convex clusters。
- 對 outliers 敏感，因為 centroid 是 mean。
- feature scaling 很重要，距離會受尺度影響。

### Objective

K-Means 最小化 within-cluster sum of squared distances：

```text
sum over all points ||x_i - centroid_of_assigned_cluster||^2
```

### Common pitfalls

- K-Means 不使用 labels。
- `k` 是 clusters 數，不是 KNN 的 neighbors 數。
- K-Means 的 centroid 是平均向量，不一定是資料中真實存在的點。
- 距離通常用 Euclidean distance。

## 8. Perceptron

這一章你 LMS 也沒有顯示已完成分數，建議優先看。

### Linear classifier

Perceptron 是 binary linear classifier。

Prediction：

```text
y_hat = sign(w @ x + b)
```

- `w`：weights
- `b`：bias
- `w @ x + b = 0`：decision boundary

### Decision boundary

在 2D 中：

```text
w1*x1 + w2*x2 + b = 0
```

- boundary 是一條線。
- `w` 是 boundary 的 normal vector。
- boundary 一邊預測 `+1`，另一邊預測 `-1`。

### Perceptron update

如果 label 是 `y`，其中 `y` 通常是 `+1` 或 `-1`：

```python
if y * (w @ x + b) <= 0:
    w = w + learning_rate * y * x
    b = b + learning_rate * y
```

意思：

- 分對：不更新。
- 分錯或剛好在 boundary：更新 `w` 和 `b`。

### Convergence

- 如果資料 linearly separable，Perceptron 可以找到一個 separating hyperplane。
- 如果資料不是 linearly separable，可能無法收斂。

### Common pitfalls

- Perceptron 不是 KNN，也不是 K-Means。
- Perceptron 是 supervised，需要 labels。
- 只能直接學 linear boundary。
- 若要處理非線性資料，需要 feature transformation 或更複雜模型。

## 9. 最後 30 分鐘檢查表

### 必背公式 / 程式

```python
np.linalg.norm(x - y)
np.linalg.norm(X - y, axis=1)
X[y == -1, :].mean(axis=0)
np.linalg.norm(X - x, axis=1).argsort()[:k]
```

### 必懂概念

- mutable vs immutable：`append` 改原物件，`+` 常產生新物件。
- NumPy `axis=0` 是沿 rows 聚合，得到每個 column 的結果。
- NCC：找最近 centroid。
- KNN：找最近 k 個 training points。
- K-Means：沒有 labels，重複分群和更新 centroid。
- Perceptron：`sign(w @ x + b)`，分錯才更新。
- Pipeline：feature extractor + model。
- Evaluation：train/test split，accuracy 在 imbalanced data 可能誤導。

### 最容易混淆

- KNN 的 `k` = neighbors 數；K-Means 的 `k` = clusters 數。
- NCC centroid 是 class mean；K-Means centroid 是 cluster mean。
- Linear classifier 的 boundary 是 linear；feature transformation 可以讓原資料空間看起來 non-linear。
- Precision 不等於 accuracy。
- Sparse text feature：大部分值是 0，不是 non-zero。

