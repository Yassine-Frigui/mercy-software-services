import random as rd 


nb_char=18

spec_char=['!','@','#','$','%','^','&','*','(',')','-','+','=','{','}','[',']',':',';','"',"'",'<','>','.','?','/','|']
nums=['0','1','2','3','4','5','6','7','8','9']
chars=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
uppercase_chars=[c.upper() for c in chars]
def generate_mypassword(pass_num):
    password=""
    i=0
    while len(password)<nb_char and i<pass_num:
        char_type=rd.randint(1,11)
        if char_type<3:
            password+=rd.choice(spec_char)
        elif 3<char_type<5:
            password+=rd.choice(nums)
        elif 5<char_type<7:
            password+=rd.choice(uppercase_chars)
        else:
            password+=rd.choice(chars)
        
        
        if len(password)==nb_char:
            i += 1
            print(password)
            password=""
        



__main__=generate_mypassword(100)
            
