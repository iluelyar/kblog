var leftContainer = document.querySelector('.kleft-container');
var rightContainer = document.querySelector('.kright-container');

document.getElementById('openKleft').addEventListener('click', function () {
    if (leftContainer.style.left === '-300px' || leftContainer.style.left === '') {
        leftContainer.style.left = '8px';
        rightContainer.style.right = '-300px';
    } else {
        leftContainer.style.left = '-300px';
    }
});

document.getElementById('openKright').addEventListener('click', function () {
    if (rightContainer.style.right === '-300px' || rightContainer.style.right === '') {
        rightContainer.style.right = '8px';
        leftContainer.style.left = '-300px';
    } else {
        rightContainer.style.right = '-300px';
    }
});
