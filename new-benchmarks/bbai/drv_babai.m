function drv_babai(size)
	R = ones(size);
	Y = ones(size, 1);
	tic();
	[vec] = babai(R, Y)
	t = toc();
  disp(t);
	
end