# coding=utf-8

f=open('./tmp','r')
tmplines=f.readlines()
f.close()



for i in range(len(tmplines)/3):
    print '\"'+tmplines[i*3].split('\n')[0]+'\":['+tmplines[i*3+1].split('\n')[0]+','+tmplines[i*3+2].split('\n')[0]+'],'