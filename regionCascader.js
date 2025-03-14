/**
 * 区域联级选择器
 * 用于处理省市县镇四级联动选择功能
 */

class RegionCascader {
    /**
     * 构造函数
     * @param {Object} options - 配置选项
     * @param {Object} options.regionData - 区域数据对象，如果为null则需要稍后通过setData方法设置
     * @param {Object} options.selectors - 选择器DOM元素或ID
     * @param {string|HTMLElement} options.selectors.province - 省级选择器
     * @param {string|HTMLElement} options.selectors.city - 市级选择器
     * @param {string|HTMLElement} options.selectors.county - 县/区级选择器
     * @param {string|HTMLElement} options.selectors.town - 镇/街道级选择器
     * @param {Object} options.callbacks - 回调函数
     * @param {Function} options.callbacks.onChange - 选择变化时的回调函数
     */
    constructor(options = {}) {
        // 区域数据
        this.regionData = options.regionData || null;
        
        // 选择器DOM元素
        this.selectors = {
            province: this._getElement(options.selectors?.province || 'province'),
            city: this._getElement(options.selectors?.city || 'city'),
            county: this._getElement(options.selectors?.county || 'county'),
            town: this._getElement(options.selectors?.town || 'town')
        };
        
        // 当前选择的值
        this.selectedValues = {
            province: '',
            city: '',
            county: '',
            town: ''
        };
        
        // 回调函数
        this.callbacks = {
            onChange: options.callbacks?.onChange || null
        };
        
        // 初始化事件监听
        this._initEventListeners();
    }
    
    /**
     * 获取DOM元素
     * @private
     * @param {string|HTMLElement} element - 元素ID或DOM元素
     * @returns {HTMLElement} - DOM元素
     */
    _getElement(element) {
        if (typeof element === 'string') {
            return document.getElementById(element);
        }
        return element;
    }
    
    /**
     * 初始化事件监听
     * @private
     */
    _initEventListeners() {
        // 省份选择变化
        if (this.selectors.province) {
            this.selectors.province.addEventListener('change', () => {
                this.selectedValues.province = this.selectors.province.value;
                this.selectedValues.city = '';
                this.selectedValues.county = '';
                this.selectedValues.town = '';
                
                this.updateCitySelect();
                this._triggerChangeCallback();
            });
        }
        
        // 城市选择变化
        if (this.selectors.city) {
            this.selectors.city.addEventListener('change', () => {
                this.selectedValues.city = this.selectors.city.value;
                this.selectedValues.county = '';
                this.selectedValues.town = '';
                
                this.updateCountySelect();
                this._triggerChangeCallback();
            });
        }
        
        // 县/区选择变化
        if (this.selectors.county) {
            this.selectors.county.addEventListener('change', () => {
                this.selectedValues.county = this.selectors.county.value;
                this.selectedValues.town = '';
                
                this.updateTownSelect();
                this._triggerChangeCallback();
            });
        }
        
        // 镇/街道选择变化
        if (this.selectors.town) {
            this.selectors.town.addEventListener('change', () => {
                this.selectedValues.town = this.selectors.town.value;
                this._triggerChangeCallback();
            });
        }
    }
    
    /**
     * 触发变化回调
     * @private
     */
    _triggerChangeCallback() {
        if (typeof this.callbacks.onChange === 'function') {
            const code = this.getSelectedCode();
            const path = this.getSelectedPath();
            
            this.callbacks.onChange({
                values: { ...this.selectedValues },
                code: code,
                path: path
            });
        }
    }
    
    /**
     * 设置区域数据
     * @param {Object} data - 区域数据对象
     */
    setData(data) {
        this.regionData = data;
        this.reset();
        this.updateProvinceSelect();
    }
    
    /**
     * 重置选择器
     */
    reset() {
        this.selectedValues = {
            province: '',
            city: '',
            county: '',
            town: ''
        };
        
        // 重置省份选择器
        if (this.selectors.province) {
            this.selectors.province.innerHTML = '<option value="">-- 请选择 --</option>';
            this.selectors.province.disabled = !this.regionData;
        }
        
        // 重置城市选择器
        if (this.selectors.city) {
            this.selectors.city.innerHTML = '<option value="">-- 请选择 --</option>';
            this.selectors.city.disabled = true;
        }
        
        // 重置县/区选择器
        if (this.selectors.county) {
            this.selectors.county.innerHTML = '<option value="">-- 请选择 --</option>';
            this.selectors.county.disabled = true;
        }
        
        // 重置镇/街道选择器
        if (this.selectors.town) {
            this.selectors.town.innerHTML = '<option value="">-- 请选择 --</option>';
            this.selectors.town.disabled = true;
        }
    }
    
    /**
     * 更新省份选择器
     */
    updateProvinceSelect() {
        if (!this.selectors.province || !this.regionData) return;
        
        const provinceSelect = this.selectors.province;
        provinceSelect.innerHTML = '<option value="">-- 请选择 --</option>';
        
        // 获取所有省份
        const provinces = this._getProvinces();
        
        // 添加省份选项
        provinces.forEach(province => {
            const option = document.createElement('option');
            option.value = province.code.substring(0, 2);
            option.textContent = province.name;
            provinceSelect.appendChild(option);
        });
        
        // 启用省份选择器
        provinceSelect.disabled = false;
    }
    
    /**
     * 更新城市选择器
     */
    updateCitySelect() {
        if (!this.selectors.city || !this.regionData) return;
        
        const citySelect = this.selectors.city;
        citySelect.innerHTML = '<option value="">-- 请选择 --</option>';
        
        // 禁用县/区和镇/街道选择器
        if (this.selectors.county) this.selectors.county.disabled = true;
        if (this.selectors.town) this.selectors.town.disabled = true;
        
        const provinceCode = this.selectedValues.province;
        
        if (!provinceCode) {
            citySelect.disabled = true;
            return;
        }
        
        // 获取城市列表
        const cities = this._getCitiesByProvince(provinceCode);
        
        // 添加城市选项
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city.code.substring(2, 4);
            option.textContent = city.name;
            citySelect.appendChild(option);
        });
        
        // 启用城市选择器
        citySelect.disabled = cities.length === 0;
    }
    
    /**
     * 更新县/区选择器
     */
    updateCountySelect() {
        if (!this.selectors.county || !this.regionData) return;
        
        const countySelect = this.selectors.county;
        countySelect.innerHTML = '<option value="">-- 请选择 --</option>';
        
        // 禁用镇/街道选择器
        if (this.selectors.town) this.selectors.town.disabled = true;
        
        const provinceCode = this.selectedValues.province;
        const cityCode = this.selectedValues.city;
        
        if (!provinceCode || !cityCode) {
            countySelect.disabled = true;
            return;
        }
        
        // 获取县/区列表
        const counties = this._getCountiesByCity(provinceCode, cityCode);
        
        // 添加县/区选项
        counties.forEach(county => {
            const option = document.createElement('option');
            option.value = county.code.substring(4, 6);
            option.textContent = county.name;
            countySelect.appendChild(option);
        });
        
        // 启用县/区选择器
        countySelect.disabled = counties.length === 0;
    }
    
    /**
     * 更新镇/街道选择器
     */
    updateTownSelect() {
        if (!this.selectors.town || !this.regionData) return;
        
        const townSelect = this.selectors.town;
        townSelect.innerHTML = '<option value="">-- 请选择 --</option>';
        
        const provinceCode = this.selectedValues.province;
        const cityCode = this.selectedValues.city;
        const countyCode = this.selectedValues.county;
        
        if (!provinceCode || !cityCode || !countyCode) {
            townSelect.disabled = true;
            return;
        }
        
        // 获取镇/街道列表
        const towns = this._getTownsByCounty(provinceCode, cityCode, countyCode);
        
        // 添加镇/街道选项
        towns.forEach(town => {
            const option = document.createElement('option');
            option.value = town.code.substring(6);
            option.textContent = town.name;
            townSelect.appendChild(option);
        });
        
        // 启用镇/街道选择器
        townSelect.disabled = towns.length === 0;
    }
    
    /**
     * 获取所有省份
     * @private
     * @returns {Array} - 省份数组
     */
    _getProvinces() {
        if (!this.regionData) return [];
        
        return Object.values(this.regionData).map(province => ({
            name: province.name,
            code: province.code
        }));
    }
    
    /**
     * 根据省代码获取城市
     * @private
     * @param {string} provinceCode - 省代码
     * @returns {Array} - 城市数组
     */
    _getCitiesByProvince(provinceCode) {
        if (!this.regionData || !this.regionData[provinceCode]) return [];
        
        return Object.values(this.regionData[provinceCode].cities).map(city => ({
            name: city.name,
            code: city.code
        }));
    }
    
    /**
     * 根据省代码和市代码获取县/区
     * @private
     * @param {string} provinceCode - 省代码
     * @param {string} cityCode - 市代码
     * @returns {Array} - 县/区数组
     */
    _getCountiesByCity(provinceCode, cityCode) {
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
     * @private
     * @param {string} provinceCode - 省代码
     * @param {string} cityCode - 市代码
     * @param {string} countyCode - 县/区代码
     * @returns {Array} - 镇/街道数组
     */
    _getTownsByCounty(provinceCode, cityCode, countyCode) {
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
     * 获取当前选择的代码
     * @returns {string} - 完整的区域代码
     */
    getSelectedCode() {
        const provinceCode = this.selectedValues.province || '00';
        const cityCode = this.selectedValues.city || '00';
        const countyCode = this.selectedValues.county || '00';
        const townCode = this.selectedValues.town || '';
        
        let code = provinceCode + cityCode + countyCode;
        if (townCode) {
            code += townCode;
        }
        
        return code;
    }
    
    /**
     * 获取当前选择的路径
     * @returns {string} - 完整的区域路径名称
     */
    getSelectedPath() {
        if (!this.regionData) return '';
        
        const provinceCode = this.selectedValues.province;
        if (!provinceCode || !this.regionData[provinceCode]) return '';
        
        const path = [this.regionData[provinceCode].name];
        
        const cityCode = this.selectedValues.city;
        if (!cityCode || !this.regionData[provinceCode].cities[cityCode]) return path.join(' > ');
        
        path.push(this.regionData[provinceCode].cities[cityCode].name);
        
        const countyCode = this.selectedValues.county;
        if (!countyCode || !this.regionData[provinceCode].cities[cityCode].counties[countyCode]) return path.join(' > ');
        
        path.push(this.regionData[provinceCode].cities[cityCode].counties[countyCode].name);
        
        const townCode = this.selectedValues.town;
        if (!townCode || !this.regionData[provinceCode].cities[cityCode].counties[countyCode].towns[townCode]) return path.join(' > ');
        
        path.push(this.regionData[provinceCode].cities[cityCode].counties[countyCode].towns[townCode].name);
        
        return path.join(' > ');
    }
    
    /**
     * 根据代码设置选择器的值
     * @param {string} code - 区域代码
     */
    setValueByCode(code) {
        if (!code || !this.regionData) return;
        
        // 重置选择器
        this.reset();
        
        // 解析代码
        const provinceCode = code.substring(0, 2);
        const cityCode = code.substring(2, 4);
        const countyCode = code.substring(4, 6);
        const townCode = code.length > 6 ? code.substring(6) : '';
        
        // 设置省份
        if (provinceCode && provinceCode !== '00' && this.regionData[provinceCode]) {
            this.selectedValues.province = provinceCode;
            this.updateProvinceSelect();
            
            if (this.selectors.province) {
                this.selectors.province.value = provinceCode;
            }
            
            // 设置城市
            if (cityCode && cityCode !== '00') {
                this.updateCitySelect();
                this.selectedValues.city = cityCode;
                
                if (this.selectors.city) {
                    this.selectors.city.value = cityCode;
                }
                
                // 设置县/区
                if (countyCode && countyCode !== '00') {
                    this.updateCountySelect();
                    this.selectedValues.county = countyCode;
                    
                    if (this.selectors.county) {
                        this.selectors.county.value = countyCode;
                    }
                    
                    // 设置镇/街道
                    if (townCode) {
                        this.updateTownSelect();
                        this.selectedValues.town = townCode;
                        
                        if (this.selectors.town) {
                            this.selectors.town.value = townCode;
                        }
                    }
                }
            }
        }
        
        // 触发变化回调
        this._triggerChangeCallback();
    }
}

// 导出类，使其可以在其他文件中使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RegionCascader;
} else {
    // 在浏览器环境中，将类添加到全局对象
    window.RegionCascader = RegionCascader;
} 