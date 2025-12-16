# 修复 Kramdown 引用块渲染问题
# Kramdown 会将引用块中连续的行合并成一个段落
# 这个插件确保引用块中的每一行都保持独立显示

Jekyll::Hooks.register [:documents, :pages], :pre_render do |document|
  # 只处理 markdown 文档
  if document.extname == '.md' || document.path&.end_with?('.md')
    content = document.content

    # 处理引用块中的连续行
    # 在引用块内部,如果两行之间有空的引用行(只有>的行),需要转换为<br>来保持换行
    fixed_content = content.gsub(/^(>.*)\n>\s*\n(>.*)/m) do
      line1 = $1
      line2 = $2
      # 在两行之间插入<br>来保持换行
      "#{line1}  \n#{line2}"
    end

    # 处理引用块中连续的非空行
    # 需要在每行末尾添加两个空格来强制换行
    lines = fixed_content.split("\n")
    in_blockquote = false
    processed_lines = []

    lines.each_with_index do |line, i|
      if line =~ /^>\s*(.*)$/
        in_blockquote = true
        content_part = $1

        # 检查下一行
        next_line = lines[i + 1]

        if next_line && next_line =~ /^>\s*(.*)$/
          next_content = $1
          # 如果当前行不为空,且下一行也不为空,在当前行末尾添加两个空格
          if !content_part.strip.empty? && !next_content.strip.empty?
            # 检查是否已经有两个空格
            unless line.end_with?('  ')
              line = line.rstrip + '  '
            end
          end
        end

        processed_lines << line
      else
        in_blockquote = false
        processed_lines << line
      end
    end

    document.content = processed_lines.join("\n")
  end
end
