/**
 * 区域数据解析器
 * 用于解析Township_Area_A_20250115_1.txt文件并生成结构化的JSON数据
 */

class RegionParser {
    constructor() {
        this.rawData = null;
        this.structuredData = null;
    }

    /**
     * 解析文件内容
     * @param {string} fileContent - 文件内容
     * @returns {Array} - 解析后的数据数组
     */
    parseFileContent(fileContent) {
        const lines = fileContent.trim().split('\n');
        const data = [];
        
        lines.forEach(line => {
            // 移除行号和竖线
            const cleanLine = line.replace(/^\d+\|\s*/, '');
            // 按制表符分割
            const parts = cleanLine.split('\t');
            
            if (parts.length >= 8) {
                data.push({
                    province: {
                        name: parts[0],
                        code: parts[1]
                    },
                    city: {
                        name: parts[2],
                        code: parts[3]
                    },
                    county: {
                        name: parts[4],
                        code: parts[5]
                    },
                    town: {
                        name: parts[6],
                        code: parts[7]
                    }
                });
            }
        });
        
        this.rawData = data;
        return data;
    }

    /**
     * 生成结构化数据
     * @returns {Object} - 结构化的数据对象
     */
    generateStructuredData() {
        if (!this.rawData) {
            throw new Error('请先解析文件内容');
        }
        
        const structure = {};
        
        this.rawData.forEach(item => {
            const provinceCode = item.province.code.substring(0, 2);
            const cityCode = item.city.code.substring(2, 4);
            const countyCode = item.county.code.substring(4, 6);
            const townCode = item.town.code.substring(6);
            
            // 初始化省级结构
            if (!structure[provinceCode]) {
                structure[provinceCode] = {
                    name: item.province.name,
                    code: item.province.code,
                    cities: {}
                };
            }
            
            // 初始化市级结构
            if (!structure[provinceCode].cities[cityCode]) {
                structure[provinceCode].cities[cityCode] = {
                    name: item.city.name,
                    code: item.city.code,
                    counties: {}
                };
            }
            
            // 初始化县/区级结构
            if (!structure[provinceCode].cities[cityCode].counties[countyCode]) {
                structure[provinceCode].cities[cityCode].counties[countyCode] = {
                    name: item.county.name,
                    code: item.county.code,
                    towns: {}
                };
            }
            
            // 添加镇/街道级记录
            structure[provinceCode].cities[cityCode].counties[countyCode].towns[townCode] = {
                name: item.town.name,
                code: item.town.code
            };
        });
        
        this.structuredData = structure;
        return structure;
    }

    /**
     * 将结构化数据保存为JSON文件
     * @param {string} filePath - 保存路径
     */
    saveToJsonFile(filePath) {
        if (!this.structuredData) {
            this.generateStructuredData();
        }
        
        // 在实际环境中，这里应该使用文件系统API保存文件
        // 在浏览器环境中，可以使用以下方式导出JSON
        const jsonString = JSON.stringify(this.structuredData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filePath || 'region_data.json';
        a.click();
        
        URL.revokeObjectURL(url);
    }
}

/**
 * 区域管理器
 * 用于管理和查询区域数据
 */
class RegionManager {
    constructor(data) {
        this.regionData = data || null;
    }

    /**
     * 从文件加载数据
     * @param {string} filePath - 文件路径
     * @returns {Promise} - 加载完成的Promise
     */
    async loadDataFromFile(filePath) {
        try {
            const response = await fetch(filePath);
            const fileContent = await response.text();
            
            const parser = new RegionParser();
            parser.parseFileContent(fileContent);
            this.regionData = parser.generateStructuredData();
            
            return this.regionData;
        } catch (error) {
            console.error('加载数据失败:', error);
            throw error;
        }
    }

    /**
     * 从JSON加载数据
     * @param {string} jsonPath - JSON文件路径
     * @returns {Promise} - 加载完成的Promise
     */
    async loadDataFromJson(jsonPath) {
        try {
            const response = await fetch(jsonPath);
            this.regionData = await response.json();
            return this.regionData;
        } catch (error) {
            console.error('加载JSON数据失败:', error);
            throw error;
        }
    }

    /**
     * 获取所有省份
     * @returns {Array} - 省份数组
     */
    getProvinces() {
        if (!this.regionData) return [];
        
        return Object.values(this.regionData).map(province => ({
            name: province.name,
            code: province.code
        }));
    }

    /**
     * 根据省代码获取城市
     * @param {string} provinceCode - 省代码
     * @returns {Array} - 城市数组
     */
    getCitiesByProvince(provinceCode) {
        if (!this.regionData || !this.regionData[provinceCode]) return [];
        
        return Object.values(this.regionData[provinceCode].cities).map(city => ({
            name: city.name,
            code: city.code
        }));
    }

    /**
     * 根据省代码和市代码获取县/区
     * @param {string} provinceCode - 省代码
     * @param {string} cityCode - 市代码
     * @returns {Array} - 县/区数组
     */
    getCountiesByCity(provinceCode, cityCode) {
        if (!this.regionData || 
            !this.regionData[provinceCode] || 
            !this.regionData[provinceCode].cities[cityCode]) return [];
        
        return Object.values(this.regionData[provinceCode].cities[cityCode].counties).map(county => ({
            name: county.name,
            code: county.code
        }));
    }

    /**
     * 根据省代码、市代码和县/区代码获取镇/街道
     * @param {string} provinceCode - 省代码
     * @param {string} cityCode - 市代码
     * @param {string} countyCode - 县/区代码
     * @returns {Array} - 镇/街道数组
     */
    getTownsByCounty(provinceCode, cityCode, countyCode) {
        if (!this.regionData || 
            !this.regionData[provinceCode] || 
            !this.regionData[provinceCode].cities[cityCode] ||
            !this.regionData[provinceCode].cities[cityCode].counties[countyCode]) return [];
        
        return Object.values(this.regionData[provinceCode].cities[cityCode].counties[countyCode].towns).map(town => ({
            name: town.name,
            code: town.code
        }));
    }

    /**
     * 根据完整代码获取地区名称
     * @param {string} code - 地区代码
     * @returns {string|null} - 地区名称
     */
    getRegionNameByCode(code) {
        if (!code) return null;
        
        const provinceCode = code.substring(0, 2);
        
        if (!this.regionData || !this.regionData[provinceCode]) return null;
        
        // 省级代码 (6位)
        if (code.length === 6 && code.endsWith('0000')) {
            return this.regionData[provinceCode].name;
        }
        
        const cityCode = code.substring(2, 4);
        
        // 市级代码 (6位)
        if (code.length === 6 && code.endsWith('00') && 
            this.regionData[provinceCode].cities[cityCode]) {
            return this.regionData[provinceCode].cities[cityCode].name;
        }
        
        const countyCode = code.substring(4, 6);
        
        // 县/区级代码 (6位)
        if (code.length === 6 && 
            this.regionData[provinceCode].cities[cityCode] &&
            this.regionData[provinceCode].cities[cityCode].counties[countyCode]) {
            return this.regionData[provinceCode].cities[cityCode].counties[countyCode].name;
        }
        
        // 镇/街道级代码 (9位)
        if (code.length === 9) {
            const townCode = code.substring(6);
            if (this.regionData[provinceCode].cities[cityCode] &&
                this.regionData[provinceCode].cities[cityCode].counties[countyCode] &&
                this.regionData[provinceCode].cities[cityCode].counties[countyCode].towns[townCode]) {
                return this.regionData[provinceCode].cities[cityCode].counties[countyCode].towns[townCode].name;
            }
        }
        
        return null;
    }

    /**
     * 获取完整的地区路径名称
     * @param {string} code - 地区代码
     * @returns {string|null} - 地区路径名称
     */
    getFullRegionPath(code) {
        if (!code) return null;
        
        let path = [];
        const provinceCode = code.substring(0, 2);
        
        if (!this.regionData || !this.regionData[provinceCode]) return null;
        
        path.push(this.regionData[provinceCode].name);
        
        // 如果只是省级代码
        if (code.length === 6 && code.endsWith('0000')) {
            return path.join(' > ');
        }
        
        const cityCode = code.substring(2, 4);
        if (!this.regionData[provinceCode].cities[cityCode]) return path.join(' > ');
        
        path.push(this.regionData[provinceCode].cities[cityCode].name);
        
        // 如果只是市级代码
        if (code.length === 6 && code.endsWith('00')) {
            return path.join(' > ');
        }
        
        const countyCode = code.substring(4, 6);
        if (!this.regionData[provinceCode].cities[cityCode].counties[countyCode]) return path.join(' > ');
        
        path.push(this.regionData[provinceCode].cities[cityCode].counties[countyCode].name);
        
        // 如果只是县级代码
        if (code.length === 6) {
            return path.join(' > ');
        }
        
        // 如果是镇/街道级代码
        if (code.length === 9) {
            const townCode = code.substring(6);
            if (!this.regionData[provinceCode].cities[cityCode].counties[countyCode].towns[townCode]) return path.join(' > ');
            
            path.push(this.regionData[provinceCode].cities[cityCode].counties[countyCode].towns[townCode].name);
        }
        
        return path.join(' > ');
    }
}

// 导出类，使其可以在其他文件中使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RegionParser, RegionManager };
} else {
    // 在浏览器环境中，将类添加到全局对象
    window.RegionParser = RegionParser;
    window.RegionManager = RegionManager;
} 