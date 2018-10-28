function drv_babai_jitted(size)
	R = randn(1000);
	Y = randn(1000, 1);
	for i = 1:5
		[vec] = babai(R, Y);
	end
	tic();
	for i = 1:size
		[vec] = babai(R, Y);
	end
	t = toc();
  disp(t);
	
end