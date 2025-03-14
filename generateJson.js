/**
 * 生成JSON数据文件
 * 
 * 此脚本用于读取Township_Area_A_20250115_1.txt文件，
 * 解析其内容，并生成结构化的JSON数据文件
 */

const fs = require('fs');
const path = require('path');
const { RegionParser } = require('./regionParser');

// 配置
const inputFile = 'Township_Area_A_20250115_1.txt';
const outputFile = 'region_data.json';

// 主函数
async function main() {
    try {
        console.log(`开始处理文件: ${inputFile}`);
        
        // 读取文件内容
        const fileContent = fs.readFileSync(inputFile, 'utf8');
        console.log(`文件读取成功，大小: ${(fileContent.length / 1024 / 1024).toFixed(2)}MB`);
        
        // 解析文件内容
        console.log('开始解析文件内容...');
        const parser = new RegionParser();
        const parsedData = parser.parseFileContent(fileContent);
        console.log(`解析完成，共 ${parsedData.length} 条记录`);
        
        // 生成结构化数据
        console.log('开始生成结构化数据...');
        const structuredData = parser.generateStructuredData();
        
        // 统计数据
        const provinceCount = Object.keys(structuredData).length;
        let cityCount = 0;
        let countyCount = 0;
        let townCount = 0;
        
        Object.values(structuredData).forEach(province => {
            const cities = province.cities;
            cityCount += Object.keys(cities).length;
            
            Object.values(cities).forEach(city => {
                const counties = city.counties;
                countyCount += Object.keys(counties).length;
                
                Object.values(counties).forEach(county => {
                    townCount += Object.keys(county.towns).length;
                });
            });
        });
        
        console.log(`结构化数据生成完成，包含:`);
        console.log(`- ${provinceCount} 个省/自治区/直辖市`);
        console.log(`- ${cityCount} 个市/自治州`);
        console.log(`- ${countyCount} 个县/区`);
        console.log(`- ${townCount} 个镇/街道`);
        
        // 保存为JSON文件
        console.log(`开始保存到文件: ${outputFile}`);
        fs.writeFileSync(outputFile, JSON.stringify(structuredData, null, 2));
        console.log(`文件保存成功，大小: ${(fs.statSync(outputFile).size / 1024 / 1024).toFixed(2)}MB`);
        
        console.log('处理完成!');
    } catch (error) {
        console.error('处理过程中出错:', error);
    }
}

// 执行主函数
main(); 