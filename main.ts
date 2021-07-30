import * as path from "https://deno.land/std@0.103.0/path/mod.ts";
import { cheerio } from "https://deno.land/x/cheerio@1.0.4/mod.ts";
const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
const cli = Deno.args;
var $ = cheerio.load(Deno.readFileSync(path.resolve(__dirname, cli[0])))

function getCategories($a) {
    var $node = $a.closest('DL').prev();
    var title = $node.text();
    var add_date = $node.attr("add_date");
    var last_modified = $node.attr("last_modified");
    if ($node.length > 0 && title.length > 0) {
        return [{
            'name': title,
            'last_modified': typeof last_modified === "undefined" ? null : last_modified ,
            'add_date': typeof add_date === "undefined" ? null : add_date,
        }].concat(getCategories($node));
    } else {
        return [];
    }
}

var jsonbmArray = []
$('a').each(function(index, a) {
    let $a = $(a)
    let add_date = $a.attr('add_date')
    let last_modified = $a.attr('last_modified')
    let description = $a.next('dd').text().split("\n")[0] // ugly but works
    let categories = getCategories($a)
    // add level information
    let new_categories = categories.reverse().map(function(currentValue, index) {
        return currentValue['level'] = index + 1, currentValue
    })
    try {
        var tags = $a.attr('tags').split(',') || []
    } catch(e) {
        var tags = []
    }
    let jsonbm = {
        'description': description,
        'title': $a.text(),
        'url': $a.attr('href'),
        'categories': categories,
        'tags': tags,
        'last_modified': typeof last_modified === "undefined" ? null : last_modified ,
        'add_date': typeof add_date === "undefined" ? null : add_date,
    }
    jsonbmArray.push(jsonbm)
})

Deno.writeFileSync(path.resolve(__dirname, cli[1]), JSON.stringify(jsonbmArray, null, 4))