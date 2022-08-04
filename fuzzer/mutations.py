
import random
import time
import math

random.seed(time.time())
f = open("inputs.txt", "w")
f.write("Fuzzing" + "\n")
f.close()
def randomChar():
    index = random.randint(0,1000)
    return chr(index)

# print(randomChar())

def randomString(input) :
    length = random.randint(0,1000)
    result = ""
    while (length > 0) :
        result += randomChar()
        length = length - 1

    return result


def changechar(input):
    l = len(input)
    if(len(input)<=0):
        l = 100


    position = random.randint(0,l)
    newinput = input[:position] + randomChar() + input[position + 1:]
    return newinput

def toBinary(a):
    l,m=[],[]
    for i in a:
        l.append(ord(i))
    for i in l:
        m.append(int(bin(i)[2:]))
    return m


def toString(a):
    print(a)
    l=[]
    m=""
    for i in a:
        b=0
        c=0
        if(i<=0):
            i=1
        k=int(math.log10(i))+1
        for j in range(k):
            b=((i%10)*(2**j))
            i=i//10
            c=c+b
        l.append(c)
    for x in l:
        m=m+chr(x)
    return m

def flip(input):

    if(len(input)<=0):
        input = "test"

    l = len(input)
    print("issue")
    print(input)
    flip_position = random.randint(0,l-1)

    # # choose a random position in the input string

    # choose a random bit in the respective character, why it is 7 and not 8?


    bininput = toBinary(input)
    binp = str(bininput[flip_position])
    flip_bit = random.randint(0,len(binp)-1)

    if(binp[flip_bit]=='1'):
        newchr = '0'
    else:
        newchr = '1'
    binpnew = binp[:flip_bit] + newchr + binp[flip_bit + 1:]

    bininput[flip_position] = int(binpnew)

    return toString(bininput)


def trim(input):
    l = len(input)
    if(len(input)<=0):
        l = 100
    trim_position = random.randint(0,l-1)
    return input[:trim_position]



def generateInputs():
    mutators = [trim,changechar,randomString,flip]
    noOfmutations = 5
    while(noOfmutations):
        mutator = random.choice(mutators)
        # noOfmutations = noOfmutations -1
        addInput(mutator(randline()))


global line


def randline():
    f = open("inputs.txt",'r')
    lines=f.read().splitlines()
    return random.choice(lines)


def addInput(input):
    f = open("inputs.txt","a")
    f.write(input+"\n")
    f.close()

generateInputs()

