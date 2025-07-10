export const validateUsername = (username) => {
  const errors = [];

  // 空文字チェック
  if (!username) {
    errors.push('ユーザー名は必須です');
    return { errors, isValid: false };
  }

  // 長さチェック（3-20文字）
  if (username.length < 3) {
    errors.push('3文字以上で入力してください');
  }
  if (username.length > 20) {
    errors.push('20文字以下で入力してください');
  }

  // 文字種チェック（半角英数字と_-.のみ）
  if (!/^[a-zA-Z0-9_.-]*$/.test(username)) {
    errors.push('半角英数字と_-.のみ使用可能です');
  }

  // 先頭文字チェック（英字または数字で始まる）
  if (username && !/^[a-zA-Z0-9]/.test(username)) {
    errors.push('英字または数字で始まる必要があります');
  }

  // 連続する記号の禁止
  if (/[_.-]{2,}/.test(username)) {
    errors.push('記号を連続して使用することはできません');
  }

  // 予約語チェック（FastAPIと同じリスト）
  const reservedWords = [
    'admin',
    'administrator',
    'root',
    'system',
    'api',
    'www',
    'mail',
    'support',
    'help',
  ];

  if (reservedWords.includes(username.toLowerCase())) {
    errors.push(`"${username}" は予約語のため使用できません`);
  }

  return {
    errors,
    isValid: errors.length === 0 && username.length >= 3,
  };
};

export const validatePassword = (password, username = '') => {
  const errors = [];

  // 空文字チェック
  if (!password) {
    errors.push('パスワードは必須です');
    return { errors, isValid: false };
  }

  // 長さチェック
  if (password.length < 8) {
    errors.push('8文字以上で入力してください');
  }
  if (password.length > 72) {
    errors.push('72文字以下で入力してください');
  }

  // 文字種チェック
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const charTypeCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(
    Boolean
  ).length;

  if (charTypeCount < 3) {
    errors.push(
      '英大文字、英小文字、数字、記号（!@#$%^&*(),.?":{}|<>）のうち3種類以上を含む必要があります'
    );
  }

  // // 弱いパスワードパターンの検出
  // const weakPatterns = [
  //   /^(.)\1+$/, // 同じ文字の繰り返し
  //   /123456/, // 連続する数字
  //   /abcdef/i, // 連続するアルファベット
  //   /password/i, // "password"を含む
  //   /qwerty/i, // キーボード配列
  // ];

  // if (weakPatterns.some((pattern) => pattern.test(password))) {
  //   errors.push('より複雑なパスワードを設定してください');
  // }

  // ユーザー名との類似性チェック
  if (username && password.toLowerCase().includes(username.toLowerCase())) {
    errors.push('ユーザー名と類似するパスワードは使用できません');
  }

  return {
    errors,
    isValid: errors.length === 0 && password.length >= 8,
  };
};

export const validateConfirmPassword = (password, confirmPassword) => {
  const errors = [];

  if (!confirmPassword) {
    errors.push('パスワード確認は必須です');
    return { errors, isValid: false };
  }

  if (password !== confirmPassword) {
    errors.push('パスワードが一致しません');
  }

  return {
    errors,
    isValid: errors.length === 0,
  };
};

// ログインフォームのバリデーション
export const validateLoginInput = (username, password) => {
  const errors = {
    username: [],
    password: [],
  };

  // 必須チェック
  if (!username.trim()) {
    errors.username.push('ユーザー名を入力してください');
  }

  if (!password) {
    errors.password.push('パスワードを入力してください');
  }

  // 基本的な長さチェック（DoS攻撃対策）
  if (username.length > 50) {
    errors.username.push('ユーザー名が長すぎます');
  }

  if (password.length > 100) {
    errors.password.push('パスワードが長すぎます');
  }

  return {
    errors,
    isValid: errors.username.length === 0 && errors.password.length === 0,
  };
};

export const validatePostForm = (formData) => {
  const errors = {
    category: [],
    title: [],
    description: [],
    recommend1: [],
    recommend2: [],
    recommend3: [],
  };

  // カテゴリ必須チェック
  if (!formData.selectedCategory) {
    errors.category.push('カテゴリを選択してください');
  }

  // ✅ タイトル: 必須、1-20文字
  if (!formData.title.trim()) {
    errors.title.push('タイトルを入力してください');
  } else if (formData.title.length < 1 || formData.title.length > 50) {
    errors.title.push('タイトルは1文字以上50文字以下で入力してください');
  }

  // ✅ 説明: 任意、ただし入力されている場合は1-300文字
  const desc = formData.description?.trim() || '';
  if (desc.length > 0) {
    // 入力されている場合のみ
    if (desc.length > 300) {
      errors.description.push('説明は300文字以下で入力してください');
    }
    // 1文字以上のチェックは不要（入力されている = 1文字以上）
  }

  // ✅ おすすめ1: 必須、1-50文字
  if (!formData.recommend1.trim()) {
    errors.recommend1.push('1位のおすすめを入力してください');
  } else if (formData.recommend1.length < 1 || formData.recommend1.length > 50) {
    errors.recommend1.push('おすすめは1文字以上50文字以下で入力してください');
  }

  // ✅ おすすめ2: 必須、1-50文字
  if (!formData.recommend2.trim()) {
    errors.recommend2.push('2位のおすすめを入力してください');
  } else if (formData.recommend2.length < 1 || formData.recommend2.length > 50) {
    errors.recommend2.push('おすすめは1文字以上50文字以下で入力してください');
  }

  // ✅ おすすめ3: 必須、1-50文字
  if (!formData.recommend3.trim()) {
    errors.recommend3.push('3位のおすすめを入力してください');
  } else if (formData.recommend3.length < 1 || formData.recommend3.length > 50) {
    errors.recommend3.push('おすすめは1文字以上50文字以下で入力してください');
  }

  return {
    errors,
    isValid: Object.values(errors).every((errorArray) => errorArray.length === 0),
  };
};

export const validateCommentForm = (formData) => {
  const errors = {
    comment: [],
  };

  // コメント必須チェック
  if (!formData.comment.trim()) {
    errors.comment.push('コメントを入力してください');
  }

  // 文字数制限チェック
  if (formData.comment.length > 200) {
    errors.comment.push('コメントは200文字以下で入力してください');
  }

  const isValid = Object.values(errors).every((errorArray) => errorArray.length === 0);

  return { isValid, errors };
};
