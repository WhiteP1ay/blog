import path from 'node:path'
import fs from 'node:fs'

// 修改：使用 process.cwd() 获取项目根目录，然后定位到 docs
const DIR_PATH = path.join(process.cwd(), 'docs')
// 白名单,过滤不是文章的文件和文件夹
const WHITE_LIST = ['index.md', '.vitepress', 'node_modules', '.idea', 'assets', 'img']


// 判断是否是文件夹
const isDirectory = (path) => fs.lstatSync(path).isDirectory()

// 取差值
const intersections = (arr1, arr2) => Array.from(new Set(arr1.filter((item) => !new Set(arr2).has(item))))

// 修改：扩展白名单检查函数
const isInWhiteList = (file) => WHITE_LIST.includes(file)

// 修改 getList 函数
function getList(params, path1, pathname) {
    const res = []
    try {
        for (let file of params) {
            // 检查是否在白名单中，如果在则跳过
            if (isInWhiteList(file)) {
                continue
            }

            const dir = path.join(path1, file)
            
            // 检查路径是否存在
            if (!fs.existsSync(dir)) {
                console.warn(`路径不存在: ${dir}`)
                continue
            }

            const isDir = isDirectory(dir)
            if (isDir) {
                const files = fs.readdirSync(dir)
                // 过滤子目录中的白名单项目
                const filteredFiles = files.filter(f => !isInWhiteList(f))
                // 只有当过滤后的文件列表不为空时才添加目录
                if (filteredFiles.length > 0) {
                    res.push({
                        text: file,
                        collapsible: true,
                        items: getList(filteredFiles, dir, `${pathname}/${file}`),
                    })
                }
            } else {
                const name = path.basename(file)
                const suffix = path.extname(file)
                if (suffix !== '.md') {
                    continue
                }
                res.push({
                    text: name.replace('.md', ''),
                    link: `${pathname}/${name}`,
                })
            }
        }
    } catch (err) {
        console.error('处理侧边栏时发生错误:', err)
    }
    return res
}

export const set_sidebar = (pathname) => {
    try {
        const dirPath = path.join(DIR_PATH, pathname)
        
        // 检查目录是否存在
        if (!fs.existsSync(dirPath)) {
            console.error(`目录不存在: ${dirPath}`)
            return []
        }

        const files = fs.readdirSync(dirPath)
        const items = intersections(files, WHITE_LIST)
        
        // 修改排序逻辑：文件在前，文件夹在后
        const sortedList = getList(items, dirPath, pathname).sort((a, b) => {
            // 如果都是文件夹或都是文件，按照文字排序
            if (!!a.items === !!b.items) {
                return a.text.localeCompare(b.text, 'zh-CN')
            }
            // 文件排在前面，文件夹排在后面
            return a.items ? 1 : -1  // 这里把 1 和 -1 对调了
        })

        return sortedList
    } catch (err) {
        console.error('生成侧边栏配置时发生错误:', err)
        return []
    }
}