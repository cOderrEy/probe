
def log(result):
    if(result != ''):
        with open("probe/result", 'a') as f:
            f.write(result+"\n")
    