clc;
clearvars;
close all;
workspace;
fontSize = 16;
 
% Read in a standard MATLAB color demo image.
folder = fileparts(which('marisoli.jpeg'));   % Doesn't actually matter, not sure what this is for
if ~exist(folder, 'dir')
    % If that folder does not exist, don't use a folder
    % and hope it can find the image on the search path.
    folder = [];
end
baseFileName = 'Test_Image.png'; % actual file name in matlab folder
fullFileName = fullfile(folder, baseFileName);
rgbImage = imread(fullFileName);
% Get the dimensions of the image.  numberOfColorBands should be = 1.
[rows, columns, numberOfColorBands] = size(rgbImage)
% Display the original gray scale image.
subplot(2, 3, 1);
imshow(rgbImage, []);
axis('on', 'image');
caption = sprintf('Original RGB Color Image\n%d rows by %d columns', rows, columns);
title(caption, 'FontSize', fontSize);
 
% Enlarge figure to full screen.
set(gcf, 'Position', get(0,'Screensize'));
set(gcf,'name','Image Analysis Demo','numbertitle','off')
drawnow;
 
% Extract the individual red, green, and blue color channels.
redChannel = rgbImage(:, :, 1);
greenChannel = rgbImage(:, :, 2);
blueChannel = rgbImage(:, :, 3);
 
blockSize = [20 20];   %20-20 for 96x96 and 96x64; 30-30 for 64x64; 60-60 for 32x32
% there will be a block of 2 by 2 output pixels, giving an output size of 64*2 = 128.
% We will still have 64 blocks across but each block will only be 2 output pixels across,
% even though we moved in steps of 4 pixels across the input image.
outputMagnificationRatio1 = 1;
meanFilterFunction1 = @(theBlockStructure) mean2(theBlockStructure.data(:)) * ones(outputMagnificationRatio1, outputMagnificationRatio1, class(theBlockStructure.data));
outputMagnificationRatio2 = 4;
meanFilterFunction2 = @(theBlockStructure) mean2(theBlockStructure.data(:)) * ones(outputMagnificationRatio2, outputMagnificationRatio2, class(theBlockStructure.data));
outputMagnificationRatio3 = 64; % To make the same size as the original image.
meanFilterFunction3 = @(theBlockStructure) mean2(theBlockStructure.data(:)) * ones(outputMagnificationRatio3, outputMagnificationRatio3, class(theBlockStructure.data));
 
%------------------------------------------------------------------------------------------------------------
% First process the image and each 64x64 block is one output pixel.
% Now,here we actually to the actual filtering.
blockyImageR = blockproc(redChannel, blockSize, meanFilterFunction1);
blockyImageG = blockproc(greenChannel, blockSize, meanFilterFunction1);
blockyImageB = blockproc(blueChannel, blockSize, meanFilterFunction1);
[blockRows, blockColumns] = size(blockyImageR)
 
% Recombine separate color channels into a single, true color RGB image.
rgbImage2 = cat(3, blockyImageR, blockyImageG, blockyImageB);
 
%Display the block mean image.
subplot(2, 3, 2);
% imshow(rgbImage2, []);
axis('on', 'image');
caption = sprintf('Block mean image with 8 blocks across.\nInput block size = %d, output block size = %d\nOutput image size = %d rows by %d columns', ...
    blockSize(1), outputMagnificationRatio1, blockRows, blockColumns);
title(caption, 'FontSize', fontSize);
 
%[ImApp,map] = rgb2ind(rgbImage2,15,'nodither');
%imshow(ImApp, map);
 
% %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% 
hexMap = {'E58E93', 'DF291E', '813232', 'E4AD3F', 'D78739', 'D1C098', 'EECC3B', 'A8BB55', '7F9585', '3AB340', '2C4C34', '7FCAE0', '0F37F8', '244261', '36328A', 'A94386', 'F1CDB7', '967955', '724629', 'F5F6F9', '969696', '757374', '6A6869', '282828'}
 
myColorMap = zeros(length(hexMap), 3); % Preallocate
for k = 1 : length(hexMap)
    thisCell = hexMap{k}
    r = hex2dec(thisCell(1:2))
    g = hex2dec(thisCell(3:4))
    b = hex2dec(thisCell(5:6))
    myColorMap(k, :) = [r, g, b]
end
myColorMap = myColorMap / 255; % Normalize to range 0-1
 
 
InvIm = rgb2ind(rgbImage2, myColorMap, 'nodither');
ImageFinal = ind2rgb(InvIm, myColorMap);
 
imshow(ImageFinal);
 
%%%%%%%%%%%%%%%%%%%%%
light_pink = 0; %1
bright_red = 0; %2
dark_red = 0;  %3
light_yellow_orange = 0; %4
bright_orange = 0; %5
brick_yellow = 0; %6
bright_yellow = 0; %7
lime = 0; %8
sand_green = 0; %9
dark_green = 0; %10
earth_green = 0; %11
pastel_blue = 0; %12
bright_blue = 0; %13
earth_blue = 0; %14
medium_lilac = 0; %15
magenta = 0; %16
light_flesh = 0; %17
sand_yellow = 0; %18
reddish_brown = 0; %19
white = 0; %20
old_light_grey = 0; %21
medium_stone_gray = 0; %22
old_dark_grey = 0; %23
dark_stone_gray = 0; %24
black = 0; %25
 
ImCount = ImageFinal * 255;
 
[frow fcol] = size(InvIm);
 
instruct_arr = zeros(frow, fcol);
for i = 1:frow
    for k = 1:fcol
        if ImCount(i,k,1)==229 & ImCount(i,k,2)==142 & ImCount(i,k,3)==147
            light_pink = light_pink + 1;
            instruct_arr(i,k)=1;
          elseif ImCount(i,k,1)==223 & ImCount(i,k,2)==41 & ImCount(i,k,3)==30
            bright_red = bright_red + 1;
            instruct_arr(i,k)=2;
          elseif ImCount(i,k,1)==129 & ImCount(i,k,2)==50 & ImCount(i,k,3)==50
            dark_red = dark_red + 1;
            instruct_arr(i,k)=3;
          elseif ImCount(i,k,1)==228 & ImCount(i,k,2)==173 & ImCount(i,k,3)==63
            light_yellow_orange = light_yellow_orange + 1;
            instruct_arr(i,k)=4;
          elseif ImCount(i,k,1)==215 & ImCount(i,k,2)==135 & ImCount(i,k,3)==57
            bright_orange = bright_orange + 1;
            instruct_arr(i,k)=5;
          elseif ImCount(i,k,1)==209 & ImCount(i,k,2)==192 & ImCount(i,k,3)==152
            brick_yellow = brick_yellow + 1;
            instruct_arr(i,k)=6;
          elseif ImCount(i,k,1)==238 & ImCount(i,k,2)==204 & ImCount(i,k,3)==59
            bright_yellow = bright_yellow + 1;
            instruct_arr(i,k)=7;
          elseif ImCount(i,k,1)==168 & ImCount(i,k,2)==187 & ImCount(i,k,3)==85
            lime = lime + 1;
            instruct_arr(i,k)=8;
          elseif ImCount(i,k,1)==127 & ImCount(i,k,2)==149 & ImCount(i,k,3)==133
            sand_green = sand_green + 1;
            instruct_arr(i,k)=9;
          elseif ImCount(i,k,1)==58 & ImCount(i,k,2)==179 & ImCount(i,k,3)==64
            dark_green = dark_green + 1;
            instruct_arr(i,k)=10;
          elseif ImCount(i,k,1)==44 & ImCount(i,k,2)==76 & ImCount(i,k,3)==52
            earth_green = earth_green + 1;
            instruct_arr(i,k)=11;
          elseif ImCount(i,k,1)==127 & ImCount(i,k,2)==202 & ImCount(i,k,3)==224
            pastel_blue = pastel_blue + 1;
            instruct_arr(i,k)=12;
          elseif ImCount(i,k,1)==15 & ImCount(i,k,2)==55 & ImCount(i,k,3)==248
            bright_blue = bright_blue + 1;
            instruct_arr(i,k)=13;
          elseif ImCount(i,k,1)==36 & ImCount(i,k,2)==66 & ImCount(i,k,3)==97
            earth_blue = earth_blue + 1;
            instruct_arr(i,k)=14;
          elseif ImCount(i,k,1)==54 & ImCount(i,k,2)==50 & ImCount(i,k,3)==138
            medium_lilac = medium_lilac + 1;
            instruct_arr(i,k)=15;
          elseif ImCount(i,k,1)==169 & ImCount(i,k,2)==67 & ImCount(i,k,3)==134
            magenta = magenta + 1;
            instruct_arr(i,k)=16;
          elseif ImCount(i,k,1)==241 & ImCount(i,k,2)==205 & ImCount(i,k,3)==183
            light_flesh = light_flesh + 1;
            instruct_arr(i,k)=17;
          elseif ImCount(i,k,1)==150 & ImCount(i,k,2)==121 & ImCount(i,k,3)==85
            sand_yellow = sand_yellow + 1;
            instruct_arr(i,k)=18;
          elseif ImCount(i,k,1)==114 & ImCount(i,k,2)==70 & ImCount(i,k,3)==41
            reddish_brown = reddish_brown + 1;
            instruct_arr(i,k)=19;
          elseif ImCount(i,k,1)==245 & ImCount(i,k,2)==246 & ImCount(i,k,3)==249
            white = white + 1;
            instruct_arr(i,k)=20;
          elseif ImCount(i,k,1)==200 & ImCount(i,k,2)==193 & ImCount(i,k,3)==181
            old_light_grey = old_light_grey + 1;
            instruct_arr(i,k)=21;
          elseif ImCount(i,k,1)==150 & ImCount(i,k,2)==150 & ImCount(i,k,3)==150
            medium_stone_gray = medium_stone_gray + 1;
            instruct_arr(i,k)=22;
          elseif ImCount(i,k,1)==117 & ImCount(i,k,2)==115 & ImCount(i,k,3)==116
            old_dark_grey = old_dark_grey + 1;
            instruct_arr(i,k)=23;
          elseif ImCount(i,k,1)==106 & ImCount(i,k,2)==104 & ImCount(i,k,3)==105
            dark_stone_gray = dark_stone_gray + 1;
            instruct_arr(i,k)=24;
          elseif ImCount(i,k,1)==40 & ImCount(i,k,2)==40 & ImCount(i,k,3)==40
            black = black + 1;
            instruct_arr(i,k)=25;  
        end
    end
end
 
number_of_colors = [light_pink 
bright_red 
dark_red  
bright_orange 
brick_yellow  
bright_yellow  
lime   
dark_green   
pastel_blue  
bright_blue  
earth_blue  
medium_lilac  
magenta  
light_flesh  
sand_yellow  
reddish_brown  
white  
medium_stone_gray   
dark_stone_gray  
black  ];
 
light_pink %1
bright_red %2
dark_red  %3
light_yellow_orange %4
bright_orange %5
brick_yellow  %6
bright_yellow  %7
lime  %8
sand_green  %9
dark_green  %10
earth_green  %11
pastel_blue  %12
bright_blue  %13
earth_blue  %14
medium_lilac  %15
magenta  %16
light_flesh  %17
sand_yellow  %18
reddish_brown  %19
white  %20
old_light_grey  %21
medium_stone_gray  %22
old_dark_grey  %23
dark_stone_gray  %24
black  %25

weight_to_pack = [ceil(10*light_pink*0.175*1.02)/10
ceil(10*bright_red*0.175*1.02)/10 
ceil(10*dark_red*0.175*1.02)/10  
ceil(10*bright_orange*0.175*1.02)/10 
ceil(10*brick_yellow*0.175*1.02)/10  
ceil(10*bright_yellow*0.175*1.02)/10  
ceil(10*lime*0.175*1.02)/10   
ceil(10*dark_green*0.175*1.02)/10   
ceil(10*pastel_blue*0.175*1.02)/10  
ceil(10*bright_blue*0.175*1.02)/10  
ceil(10*earth_blue*0.175*1.02)/10  
ceil(10*medium_lilac*0.175*1.02)/10  
ceil(10*magenta*0.175*1.02)/10  
ceil(10*light_flesh*0.175*1.02)/10  
ceil(10*sand_yellow*0.175*1.02)/10  
ceil(10*reddish_brown*0.175*1.02)/10  
ceil(10*white*0.175*1.02)/10  
ceil(10*medium_stone_gray*0.175*1.02)/10   
ceil(10*dark_stone_gray*0.175*1.02)/10  
ceil(10*black*0.175*1.02)/10  ];