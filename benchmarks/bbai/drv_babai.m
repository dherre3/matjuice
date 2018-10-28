function drv_babai(size)
	R = randn(1000);
	Y = randn(1000, 1);
	tic();
    for i = 1:size
			[vec] = babai(R, Y);
    end
	t = toc();
  disp(t);
	
end