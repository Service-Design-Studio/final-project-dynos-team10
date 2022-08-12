from email import charset
import os
import math
import random
import io
from array import array
import numpy as np
import shutil
from PIL import Image
import random
import uuid
from PIL import Image, ImageDraw

def readimage(path):
    count = os.stat(path).st_size / 2
    with open(path, "rb") as f:
        return bytearray(f.read())


def image_to_cols(image):
    """
    Helper function to convert a 2D image into an array of columns
    """
    arr = np.asarray(image)
    return list(zip(*arr))


def cols_to_image(cols):
    """
    Helper function to convert an array of columns back to 2D image so we can save it back to file
    """
    rows = list(zip(*cols))
    return Image.fromarray(np.array(rows, dtype=np.uint8))


def col_to_bytes(col, top_down=False):
    """
    Helper function to convert each pixel tuple to bytes. Iterate the column top-down or bottom-up
    """
    out = []
    for pixel in col[:: (1, -1)[top_down]]:
        out.insert(0, tuple_to_bytes(pixel))
    return b"".join(out)


def tuple_to_bytes(x):
    """
    Helper function to convert a tuple of integers into bytes
    """
    return int.from_bytes(list(x), byteorder="big").to_bytes(
        3, byteorder="big"
    )


def bytes_to_col(x, length, top_down=False):
    """
    Helper function to convert each pixel value in bytes back to tuple. Iterate the column top-down or bottom-up
    """
    out = []

    x = int.from_bytes(x[::-1], byteorder="big")
    for _ in range(length):
        pixel = []
        for _ in range(3):
            if top_down:
                pixel.append(x & 0xFF)
            else:
                pixel.insert(0, x & 0xFF)
            x >>= 8
        if top_down:
            out.append(pixel)
        else:
            out.insert(0, pixel)
    return out

def newname():
    chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    ext_len = random.randint(0,len(chars))
    ext = ""
    for i in range(ext_len):
        exti = random.randint(0,len(chars)-1)
        ext+=chars[exti]
    outname = ext + ".jpg"
    print(outname)
    return outname

    #mutator functions

def fullrand(col_bytes):
    newcolbytes = list(col_bytes)
    pos = random.randint(0,len(newcolbytes))
    for i in newcolbytes:
        # print("fullr")
        # print(i)
        newb = random.randint(0,255)
        i = newb
        # print(i)

    return bytearray(newcolbytes)


def randchange(col_bytes):
    newcolbytes = list(col_bytes)
    pos = random.randint(0,len(newcolbytes)-1)
    newb = random.randint(0,255)
    newcolbytes[pos] = newb
    return bytearray(newcolbytes)


def randswap(col_bytes):
    newcolbytes = list(col_bytes)
    pos = random.randint(0,len(newcolbytes)-1)
    newcolbytes[0:pos],newcolbytes[pos+1:0] = newcolbytes[pos+1:0],newcolbytes[0:pos]
    return bytearray(newcolbytes)


def enc_img():
    input_filename = randline()
    top_down=False
    # Load the image
    im = Image.open(input_filename)
    output_filename = newname()
    # Prepare an array to hold encrypted column values
    encrypted_cols = []

    # Iterate through all columns in the image
    for col in image_to_cols(im):

        column_bytes = col_to_bytes(col, top_down)
        mutators = [randchange,randswap,fullrand]
        mutator = random.choice(mutators)
        new_col_bytes = mutator(column_bytes)

        try:
            # Convert back the encrypted column bytes to tuple of int
            encrypted_col = bytes_to_col(new_col_bytes, im.height, top_down)

            # Append the result to the array
            encrypted_cols.append(encrypted_col)
        except:
            print("cant make img")
            exit()

    encrypted_image = cols_to_image(encrypted_cols)

    # Save the image to file
    encrypted_image.save(output_filename)
    addFileNametoLog(output_filename)


def generate_random_image():
    width=random.randint(0,255)
    height=random.randint(0,255)
    rand_pixels = [random.randint(0, 255) for _ in range(width * height * 3)]
    rand_pixels_as_bytes = bytes(rand_pixels)
    text_and_filename = str(uuid.uuid4())

    random_image = Image.frombytes('RGB', (width, height), rand_pixels_as_bytes)

    draw_image = ImageDraw.Draw(random_image)
    draw_image.text(xy=(0, 0), text=text_and_filename, fill=(255, 255, 255))
    random_image.save("{file_name}.jpg".format(file_name=text_and_filename))
    addFileNametoLog(text_and_filename)


def randimg():
    a = np.random.rand(30,30,3) * 255
    im_out = Image.fromarray(a.astype('uint8')).convert('RGB')
    output_filename = newname()
    im_out.save(output_filename)
        # addFileNametoLog(text_and_filename)


def addFileNametoLog(input):
    f = open("filenames.txt","a")
    f.write(input+"\n")
    f.close()

def randline():
    f = open("filenames.txt",'r')
    lines=f.read().splitlines()
    return random.choice(lines)

# def combine2():

imgtypes = [enc_img,randimg,generate_random_image,enc_img]

f = open("filenames.txt", "w")
f.write("grp logo copy.jpg" + "\n")
f.close()

noofimg = 5

while noofimg:
    imgfunc = random.choice(imgtypes)
    imgfunc()
    noofimg = noofimg-1
