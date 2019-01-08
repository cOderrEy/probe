import random

def confuse_js(js_name):
    context = ""
    full_keys = "αβγδεζνξοπρσηθικλμτυφχψωΑΒΓΔΕΖΝΞΟΠΡΣΗΘΙΚΛΜΤΥΦΧΨΩ사서셔수abcdefghijk슈스시뺘삐캐컈케켸콰쾨WEENVZXU쿼퀘랑OIWNTEN마만망바밤밥방えエおオれレろロやヤAけケどドずズぽポんンとトむムゐヰかカ"
    keys_array = list(set(random.sample(full_keys, len(full_keys))))[0:30]
    result = ""
    with open("probe/"+js_name) as f:
        context = f.read()
    for char in context:
        if char in keys_array:
            continue
        else:
            keys_array.append(char)
    key_num = random.randint(int(len(keys_array)/4), int(len(keys_array)/2))
    for char in context:
        index = keys_array.index(char)
        result += keys_array[(index + key_num) % (len(keys_array))]
    frame = ''
    with open("probe/frame") as f:
        lines = f.readlines()
        frame += lines[0].strip('\n')
        keys_array = "".join(keys_array)
        keys_array = keys_array.replace('\\', '\\\\')
        keys_array = keys_array.replace('\n', '\\n')
        keys_array = keys_array.replace('\'', '\\\'')
        keys_array = keys_array.replace('\"', '\\\"')
        frame += keys_array
        frame += lines[1].strip('\n')
        result = result.replace('\\', '\\\\')
        result = result.replace('\n', '\\n')
        result = result.replace('\'', '\\\'')
        result = result.replace('\"', '\\\"')
        frame += result
        frame += lines[2].strip('\n')
        frame += str(key_num)
        frame += lines[3].strip('\n')
    return frame
    

if __name__ == '__main__':
    print(confuse_js("prove.js"))