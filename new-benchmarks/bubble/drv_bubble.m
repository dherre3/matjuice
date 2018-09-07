function [y] =  drv_bubble(size)
A= colon(10000,-1,1);
A=100*A;
tic();
y=bubble(A);
t = toc();
disp(t);
end
