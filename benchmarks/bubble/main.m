function main(size)
  A = rand(1, size);
  % tic();
  y = bubble(A);
 % t = toc();

  for i = 1:size
      disp(y(i));
  end
  %disp(t);
end
