<?php

class View {
    public function renderWithLayout($view, $data = []) {
        $content = $this->render($view, $data);

        $viewFile = __DIR__ . '/layout.php';

        extract($data);

        ob_start();
        include $viewFile;
        return ob_get_clean();
    }

    private function render($view, $data = []) {
        $viewFile = __DIR__ . '/' . $view . '.php';
        
        if (!file_exists($viewFile)) {
            throw new Exception("View not found: " . $viewFile);
        }

        extract($data);
        
        ob_start();
        include $viewFile;
        return ob_get_clean();
    }
}