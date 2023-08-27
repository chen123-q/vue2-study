// 标签名 a-aaa
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
// 命名空间标签 aa:aa-xxx
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
// 开始标签-捕获标签名
const startTagOpen = new RegExp(`^<${qnameCapture}`);
// 结束标签-匹配标签结尾的 </div>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
// 匹配属性 第一个分组是key,345是值
const attribute =
    /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// 匹配标签结束的 >
const startTagClose = /^\s*(\/?)>/;
// 匹配 {{ }} 表达式
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;



function parseHTML(html) { //html 最开始是一个<div>
    const ELEMENT_TYPE = 1
    const TEXT_TYPE = 3
    const stack = [] // 存放元素
    let currentParent // 指向栈中的最后一个
    let root

    // 最终转化成一颗抽象语法树
    function creatASTElenment(tag, attrs) {
        return {
            tag,
            type: ELEMENT_TYPE,
            children: [],
            attrs,
            parent: null
        }
    }
    function start(tag, attrs) {
        let node = creatASTElenment(tag, attrs);
        if (!node) {
            root = node // 如果为空则是当前树的根节点
        }
        if (currentParent) {
            node.parent = currentParent
            currentParent.children.push(node)
        }
        stack.push(node)
        currentParent = node //currentParent为栈中的最后一个
    }
    function chars(text) {
        text = text.replace(/\s/g, '')
        currentParent.children.push({
            type: TEXT_TYPE,
            text,
            parent: currentParent
        })
    }
    function end(tag) {
        let node = stack.pop()
        currentParent = stack[stack.length - 1]
    }




    function advance(n) {
        html = html.substring(n);
    }
    function parseStarTag() {
        const start = html.match(startTagOpen);
        if (start) {
            const match = {
                tagName: start[1],
                attrs: [],
            };
            advance(start[0].length);

            // 如果不是开始标签的结束 (>) 就一直匹配下去
            let attr, end;
            while (
                !(end = html.match(startTagClose)) &&
                (attr = html.match(attribute))
            ) {
                advance(attr[0].length);
                match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] || true })
            }
            if (end) {
                advance(end[0].length);
            }
            console.log('开始标签', match);
            return match
        }
        return false;
    }

    while (html) {
        // 如果textEnd为0说明是一个开始标签或结束标签
        let textEnd = html.indexOf("<");
        if (textEnd == 0) {
            const startTagMatch = parseStarTag(); // 开始标签的匹配结果
            const endTagMatch = html.match(endTag) // 结束标签
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue
            }
            if (endTagMatch) {
                advance(endTagMatch[0].length)
                start(endTagMatch[1])
                continue
            }
        }
        // 如果textEnd > 0说明就是文本的结束位置 eg:{{name}}<span></span>
        if (textEnd > 0) {
            let text = html.substring(0, textEnd) // 文本
            if (text) {
                advance(text.length)
                end(text)
                continue
            }

        }
    }

    return root
}

export function compileToFunction(template) {
    // 1. 将template转化成ast语法树
    let ast = parseHTML(template);
    console.log(ast);
    // 2.生成render方法
}
