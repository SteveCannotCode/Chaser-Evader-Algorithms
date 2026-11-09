# Chaser-Evader Algorithms

A locally hosted grid editor for setting up Chaser vs. Evader algorithm experiments. This first version provides an editable grid, configuration controls, and a results view. The algorithm selectors and results table are UI only; simulation, saving, and loading are not implemented yet.

## Run on localhost

No packages or build step are needed. From the project folder, start Python's built-in web server:

```powershell
py -m http.server 8000
```

If `py` is not available but Python is installed, use:

```powershell
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser. Stop the server with **Ctrl+C** in the terminal.

## Using the grid

- Set the number of columns and rows independently from 10 to 50. Existing cells in the overlapping area are preserved when resizing.
- Click a grid cell to cycle through **empty → wall → chaser → evader → empty**. There can be at most one chaser and one evader; clicking skips a chaser or evader property if one is already on another cell.
- Choose planned chaser and evader algorithms and adjust the move delay. These controls do not run a simulation yet.
- Open **Display results** to see the metrics table and its not-yet-implemented state.
