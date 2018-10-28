function drv_bubble_jitted(size)
A= rand(3000,1);
A=10000*A;
% Warm-up iters
for i=1:5
y=bubble(A);
end
% Steady state iters
tic();
for i=1:size
y=bubble(A);
end
t = toc();
disp(t);
end
