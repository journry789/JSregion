# 中国行政区划数据查询系统

这个项目是一个用于解析和查询中国行政区划数据的系统。它可以将行政区划数据文件解析为结构化的JSON数据，并提供多种查询方式。

## 功能特点

- 解析行政区划数据文件（Township_Area_A_20250115_1.txt）
- 生成结构化的JSON数据
- 提供省市县镇四级联动查询
- 支持通过行政区划代码查询地区
- 数据可视化展示

## 文件说明

- `regionParser.js` - 区域数据解析器和管理器类
- `generateJson.js` - 用于生成JSON数据文件的Node.js脚本
- `sampleData.js` - 包含示例数据
- `index.html` - HTML演示页面
- `region_data.json` - 生成的JSON数据文件（如果已生成）

## 数据格式

原始数据文件中的每一行包含以下信息：

```
行号| 省名称 省代码 市名称 市代码 县/区名称 县/区代码 镇/街道名称 镇/街道代码
```

例如：
```
39986| 贵州省 520000 毕节市 520500 七星关区 520502 德溪街道 520502010
```

代码规则：
- 省代码：前两位数字（如52）
- 市代码：第3-4位数字（如05）
- 县/区代码：第5-6位数字（如02）
- 镇/街道代码：最后三位数字（如010）

## 使用方法

### 生成JSON数据文件

如果你想从原始数据文件生成JSON数据文件，可以使用Node.js运行以下命令：

```bash
node generateJson.js
```

这将读取`Township_Area_A_20250115_1.txt`文件，解析其内容，并生成`region_data.json`文件。

### 使用HTML演示页面

由于浏览器的安全限制，直接打开HTML文件可能无法加载本地JSON文件。有两种方式解决这个问题：

#### 方式一：使用内置的Node.js服务器（推荐）

1. 确保已安装Node.js
2. 在命令行中运行：
   ```bash
   node server.js
   ```
3. 在浏览器中访问：http://localhost:3000
4. 点击"加载数据"按钮加载完整的JSON数据

#### 方式二：使用http-server

1. 安装http-server（如果尚未安装）：
   ```bash
   npm install -g http-server
   ```
2. 在项目目录下运行：
   ```bash
   http-server
   ```
3. 在浏览器中访问：http://localhost:8080
4. 点击"加载数据"按钮加载完整的JSON数据

#### 方式三：使用示例数据

如果无法使用本地服务器，也可以直接使用内置的示例数据：

1. 直接在浏览器中打开`index.html`文件
2. 当JSON加载失败时，点击"使用示例数据"按钮

### 功能使用

加载数据后，可以使用以下功能：
- 区划查询：通过省市县镇四级联动选择查询
- 代码查询：输入行政区划代码查询对应地区
- 数据预览：查看数据统计和样例

## 开发者API

### RegionParser类

用于解析行政区划数据文件并生成结构化数据。

```javascript
const parser = new RegionParser();
parser.parseFileContent(fileContent);
const structuredData = parser.generateStructuredData();
```

### RegionManager类

用于管理和查询行政区划数据。

```javascript
const manager = new RegionManager(structuredData);

// 获取所有省份
const provinces = manager.getProvinces();

// 根据省代码获取城市
const cities = manager.getCitiesByProvince('52');

// 根据省市代码获取县/区
const counties = manager.getCountiesByCity('52', '05');

// 根据省市县代码获取镇/街道
const towns = manager.getTownsByCounty('52', '05', '02');

// 根据代码获取地区名称
const name = manager.getRegionNameByCode('520502010');

// 获取完整的地区路径
const path = manager.getFullRegionPath('520502010');
// 返回: "贵州省 > 毕节市 > 七星关区 > 德溪街道"
```

### RegionCascader类

用于处理省市县镇四级联动选择功能，提供了更友好的UI交互。

```javascript
// 创建联级选择器实例
const cascader = new RegionCascader({
    // 选择器DOM元素ID
    selectors: {
        province: 'province',
        city: 'city',
        county: 'county',
        town: 'town'
    },
    // 选择变化时的回调函数
    callbacks: {
        onChange: function(data) {
            console.log('选择变化:', data);
            // data.values - 当前选择的值
            // data.code - 完整的区域代码
            // data.path - 完整的区域路径名称
        }
    }
});

// 设置数据
cascader.setData(structuredData);

// 根据代码设置选择器的值
cascader.setValueByCode('520502010');

// 获取当前选择的代码
const code = cascader.getSelectedCode();

// 获取当前选择的路径
const path = cascader.getSelectedPath();
```

查看 `cascader-demo.html` 文件获取更详细的使用示例。

## 许可证

MIT 