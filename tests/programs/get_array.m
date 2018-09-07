function get_array(scale)
scale = 10000000
tic();

G = [2,1;2,3];

A = randn(3,6,2)
e = A(3,2,1)
disp(G)

A = colon(2,[2,3],8);

disp(A)

B = randn(3,7,3);
D = B(1:2,[1,2],2);

disp(D)
A = randn(scale,7,2);
t = toc();
disp(t)
tic();
for i=1:scale
  A(i,7,2) = i;
end
disp(A)
t = toc();
disp(t)
end