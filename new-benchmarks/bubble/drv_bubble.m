function [y] =  drv_bubble(size)
A=(randn(1,size));
A=100*A;
y=bubble(A);
disp(y)
end
