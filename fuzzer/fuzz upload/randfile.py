from email import charset
import os
import math
import random
import shutil

tryno = 3

while tryno:

    my_file = "grp logo copy.jpg"

    chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

    ext_len = random.randint(0,len(chars))
    ext = "."
    for i in range(ext_len):
        exti = random.randint(0,len(chars)-1)
        ext+=chars[exti]
    tryno = tryno - 1
    print(ext)
    base = os.path.splitext(my_file)[0]
    shutil.copyfile(my_file, my_file+base+ext)

